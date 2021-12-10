import { json } from 'stream/consumers';
import { debug, time } from 'console';
import { Commander } from './commander';
import { Battle } from '../battle';
import {
  createEntityWizzard,
  createEnemyStake,
  createTeamDPS,
  createEnemyBoss,
  createDead,
} from '../entitys';
import { GameConfig } from '../game';
import { SHLog } from '../utils';

const program = new Commander();
program
  .options('-t --time', 'time', 60)
  .options('-l --log-level', 'logLevel', 1)
  .options('--times', 'times', 1)
  .register('stake', stakeSim)
  .register('battle', battleSim)
  .register('play', play);

if (typeof process !== 'undefined' && process.argv.length > 2) {
  program.run();
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
  battle.teams.push(createEntityWizzard(battle));
  battle.enemys.push(createEnemyStake(battle));

  const timeStart = new Date().getTime();

  let step = 3600 * 10;
  let target = step;
  battle.on('update', () => {
    if (battle.time > target) {
      const timeDuring = ((new Date().getTime() - timeStart) / 1000).toFixed(2);
      SHLog.info(`(${timeDuring}s)running: ${battle.time}/${battle.timeLimit}`);
      target += step;
    }
  });

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
    SHLog.info(`times ${i}`);
    const battle = new Battle();
    battle.timeLimit = timeLimit;

    const c1 = createEntityWizzard(battle);
    const c2 = createTeamDPS(battle, 'c2', 1000, 100);
    const c3 = createTeamDPS(battle, 'c3', 1000, 130);
    const c4 = createTeamDPS(battle, 'c4', 1000, 160);
    const c5 = createTeamDPS(battle, 'c5', 1000, 190);
    battle.teams = [c1, c2, c3, c4, c5];
    battle.enemys = [createEnemyBoss(battle)];
    battle.start();
    if (times === 1) {
      battle.skada.outPut(options.target);
    } else {
      SHLog.info(battle.gameResult);
    }

    if (!results[battle.gameResult]) {
      results[battle.gameResult] = 0;
    }
    results[battle.gameResult]++;
  }
  if (times !== 1) {
    SHLog.info('all sim end');
    SHLog.table(results, 3);
  }

  return results;
}

export function play(options) {
  const timeLimit = Number(options.time);
  const log_level = Number(options.logLevel);
  GameConfig.logLevel = log_level;

  const battle = new Battle();
  battle.timeLimit = timeLimit;

  const c1 = createDead(battle);
  const c2 = createTeamDPS(battle, 'c2', 3000, 200);
  battle.teams = [c1, c2];
  battle.enemys = [createEnemyBoss(battle)];

  battle.start();
  battle.skada.outPut(options.target);
}
