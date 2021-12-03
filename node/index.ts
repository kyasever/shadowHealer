import { json } from 'stream/consumers';
import { Battle, FrameCount, GameConfig } from '../core/common';
// https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md#%e5%91%bd%e4%bb%a4
import { SHLog } from '../core/log';
import { debug, time } from 'console';
import { Commander } from './commander';
import { CharacterFactory } from '../core/characters';
import { loadData } from '../core/data';
const program = new Commander();
program
  .options('-t --time', 'time', 60)
  .options('-l --log-level', 'logLevel', 1)
  .options('--times', 'times', 1)
  .register('stake', stakeSim)
  .register('battle', battleSim)
  .register('load', load);

if (typeof process !== 'undefined' && process.argv.length > 2) {
  program.run();
}

async function load(file) {
  return loadData(file);
}

export function run(cmd: string) {
  return program.run(cmd);
}

export function stakeSim(options) {
  const timeLimit = Number(options.time);
  const log_level = Number(options.logLevel);

  GameConfig.logLevel = log_level;

  const battle = new Battle();
  battle.timeLimit = timeLimit;
  battle.teams.push(CharacterFactory.wizzard());
  battle.enemys.push(CharacterFactory.enemyStake());

  battle.init();

  const timeStart = new Date().getTime();

  let step = 3600 * 10;
  let target = step;
  battle.onUpdate = () => {
    if (battle.time > target) {
      const timeDuring = ((new Date().getTime() - timeStart) / 1000).toFixed(2);
      console.log(
        `(${timeDuring}s)running: ${battle.time}/${battle.timeLimit}`
      );
      target += step;
    }
  };

  battle.start();

  battle.skada.outPut();

  return 'end';
}

// battle -t 3000 --times 100 -l 5 100次模拟

export function battleSim(options) {
  const timeLimit = Number(options.time);
  const log_level = Number(options.logLevel);
  GameConfig.logLevel = log_level;
  const times = Number(options.times);

  const results = {};
  for (let i = 0; i < times; i++) {
    console.log(`times ${i}`);
    const battle = new Battle();
    battle.timeLimit = timeLimit;

    const c1 = CharacterFactory.wizzard();
    const c2 = CharacterFactory.teamDPS('c2', 1000, 100);
    const c3 = CharacterFactory.teamDPS('c3', 1000, 130);
    const c4 = CharacterFactory.teamDPS('c4', 1000, 160);
    const c5 = CharacterFactory.teamDPS('c5', 1000, 190);
    battle.teams = [c1, c2, c3, c4, c5];
    battle.enemys = [CharacterFactory.enemyBoss()];

    battle.init();
    battle.start();
    if (times === 1) {
      battle.skada.outPut(options.target);
    } else {
      console.log(battle.gameResult);
    }

    if (!results[battle.gameResult]) {
      results[battle.gameResult] = 0;
    }
    results[battle.gameResult]++;
  }
  if (times !== 1) {
    console.log('all sim end');
    console.table(results);
  }

  return results;
}

// 读取存档
export function initGame() {}
