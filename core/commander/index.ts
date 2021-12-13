import { Battle } from '@core/battle';
import { createEntity } from '@core/entitys';
import { GameConfig } from '@core/game';
import { Commander } from './commander';

const program = new Commander();
program
  .options('-t --time', 'time', 60)
  .options('-l --log-level', 'logLevel', 1)
  .register('test', async () => {
    const battle = new Battle();

    console.time('1');

    const c3 = createEntity('monk', battle);
    battle.teams = [c3];
    battle.enemys = [createEntity('stake', battle)];
    battle.timeLimit = 360000;
    GameConfig.logLevel = 5;
    GameConfig.speed = 0;
    battle.init();

    console.log('start');
    await battle.run();
    console.log('end');

    battle.skada.getEntityDetails('monk');
    console.timeEnd('1');
  });

export function run(cmd: string) {
  return program.run(cmd);
}
