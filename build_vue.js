const fs = require('fs');
const child_process = require('child_process');
const { exit } = require('process');

if (process.argv.length < 3) {
  console.error('请输入version');
} else {
  const version = process.argv[2];
  console.log(`准备发布, 版本号${version}`);
  main(version);
}

async function main(version) {
  console.log('step1 安装依赖');
  await exec('yarn');
  console.log('step2 打包vue');
  await exec('yarn build-vue');
  console.log('step3 复制资源文件');
  await exec('cp -r ./assets ./dist');
  console.log('step4 准备coscmd');
  try {
    await exec('coscmd');
  } catch (e) {
    if (typeof e !== 'number') {
      console.log('未检测到coscmd,尝试安装,需要python');
      await exec('pip install coscmd');
    }
  }
  console.log('step5 上传cos');
  await publish(version);

  console.log(
    '已上传https://sh-1302744707.cos-website.ap-beijing.myqcloud.com '
  );
  console.log(
    `访问: https://sh-1302744707.cos.ap-beijing.myqcloud.com/${version}/index.html 预览效果`
  );
}

async function publish(version) {
  const cos_config =
    'coscmd config -a AKIDYv2sRkmW0kDPKzNUKuDF0VifLktlMhlZ -s Ypqb4GBpCI7fwwf9MIxLTLwFI4Yli01l -b sh-1302744707 -r ap-beijing';
  await exec(cos_config);
  const cos_upload = `coscmd upload -r ./dist/ /${version}`;
  await exec(cos_upload);
}

function exec(cmd) {
  console.log(`\x1B[32m 执行cmd: ${cmd}\x1B[39m`);
  return new Promise((resolve, reject) => {
    const ll = cmd.split(' ');
    const cmd_process = child_process.spawn(ll[0], ll.slice(1));

    cmd_process.stdout.on('data', (data) => {
      const str = String(data).replace('\n', '');
      console.log(str);
    });

    cmd_process.stderr.on('data', (data) => {
      const str = String(data).replace('\n', '');
      console.error(str);
    });

    cmd_process.on('error', (err) => {
      reject(err);
    });

    cmd_process.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(code);
      }
    });
  });
}
