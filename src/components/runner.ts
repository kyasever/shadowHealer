import { Battle } from '@core/battle';
import { createEntity } from '@core/entitys';

export function createBattle(): Battle {
  const battle = new Battle();
  const c1 = createEntity('wuzzard', battle);
  const c2 = createEntity('normalDPS', battle);
  const c3 = createEntity('normalDPS', battle);
  const c4 = createEntity('normalDPS', battle);
  const c5 = createEntity('normalDPS', battle);
  battle.teams = [c1, c2, c3, c4, c5];
  battle.enemys = [createEntity('normalBOSS', battle)];
  return battle;
}

export function custom1() {
  const battle = new Battle();

  // const c1 = createDead(battle);
  // const c2 = createTeamDPS(battle, 'c2', 3000, 200);
  const c3 = createEntity('monk', battle);
  battle.teams = [c3];
  battle.enemys = [createEntity('stake', battle)];
  battle.timeLimit = 300;
  return battle;
}
