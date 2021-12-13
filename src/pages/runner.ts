import { Battle } from '@core/battle';
import { createEntity } from '@core/entitys';

// 对应第二个创建按钮
export function createBattle(): Battle {
  const battle = new Battle();
  const c1 = createEntity('wizzard', battle);
  const c2 = createEntity('monk', battle);
  const c3 = createEntity('normalDPS', battle);
  const c4 = createEntity('normalDPS', battle);
  const c5 = createEntity('normalDPS', battle);
  battle.teams = [c1, c2, c3, c4, c5];
  battle.enemys = [createEntity('normalBOSS', battle)];
  return battle;
}

// 对应第一个创建按钮
export function custom1(): Battle {
  const battle = new Battle();

  // const c1 = createDead(battle);
  // const c2 = createTeamDPS(battle, 'c2', 3000, 200);
  const c3 = createEntity('monk', battle);
  battle.teams = [c3];
  battle.enemys = [createEntity('stake', battle)];
  battle.timeLimit = 3600;
  return battle;
}
