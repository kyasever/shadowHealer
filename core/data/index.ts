import cc from './character.json';

// 这里面静态保存json格式的游戏数据, 可以从这里初始化创建对象
// 关卡配置可以用这个, skill buff character强行用这个就太蠢了...
// 或者考虑灵活性, 不一定全json, 也可以用全js保存数据
export function loadData(filename: string) {
  console.log(cc);
  //return cc;
  return 1;
}
