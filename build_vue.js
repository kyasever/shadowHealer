const fs = require('fs');
const child_process = require('child_process');

/*
    "build": "yarn tsc",
    "run-test": "rm -rf scratch && node ./bin/index.js auto",
    "output-bin": "echo 收集构建产物 && tar czf output.tar.gz --directory=./bin .",
    "output-save": "echo 收集存档 && tar czf save.tar.gz --directory=./scratch .",
    "test": "yarn jest",
    "test-coverage": "yarn jest --coverage",
    "ci": "echo 以下操作等同于CI,包含编译,冒烟,单元测试三个部分 && yarn && yarn build && yarn output-bin && yarn run-test && yarn output-save && yarn test"
*/

if (process.argv.length < 3) {
  console.error('请输入version');
} else {
  const version = process.argv[2];
  console.log(`准备发布, 版本号${version}`);
  build_vue()
    .then(() => {
      // 复制资源文件
      exec('cp -r ./assets ./dist');
    })
    .then(() => {
      publish(version);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function build_vue() {
  await exec('yarn && yarn build-vue').catch((err) => {
    console.error('build-vue 失败');
    process.exit(1);
  });
}

async function publish(version) {
  const cos_config =
    'coscmd config -a AKIDYv2sRkmW0kDPKzNUKuDF0VifLktlMhlZ -s Ypqb4GBpCI7fwwf9MIxLTLwFI4Yli01l -b sh-1302744707 -r ap-beijing';
  await exec(cos_config);

  const cos_upload = `coscmd upload -r ./dist/ /${version}`;

  await exec(cos_upload);

  console.log(
    '已上传https://sh-1302744707.cos-website.ap-beijing.myqcloud.com '
  );

  console.log(
    `访问: https://sh-1302744707.cos.ap-beijing.myqcloud.com/${version}/index.html 预览效果`
  );
}

function exec(cmd) {
  return new Promise((resolve, reject) => {
    child_process
      .exec(cmd, { encoding: 'utf-8' }, function(error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          console.log('Error code: ' + error.code);
          console.log('Signal received: ' + error.signal);
        }
        console.warn(stderr);
        // 结果
        console.log(stdout);
      })
      .on('exit', function(code) {
        if (code !== 0) {
          reject(code);
        }
        resolve(0);
      });
  });
}
