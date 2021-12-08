import {
  CharacterWizzard,
  createDead,
  createEnemyBoss,
  createEnemyStake,
  createEntityMonk,
  createTeamDPS,
} from '@core/characters';
import { Battle, GameConfig } from '@core/common';

export function createBattle(): Battle {
  const battle = new Battle();
  const c1 = new CharacterWizzard(battle);
  const c2 = createTeamDPS(battle, 'c2', 1000, 100);
  const c3 = createTeamDPS(battle, 'c3', 1000, 130);
  const c4 = createTeamDPS(battle, 'c4', 1000, 160);
  const c5 = createTeamDPS(battle, 'c5', 1000, 190);
  battle.teams = [c1, c2, c3, c4, c5];
  battle.enemys = [createEnemyBoss(battle)];
  battle.init();
  return battle;
}

export function custom1() {
  const battle = new Battle();

  // const c1 = createDead(battle);
  // const c2 = createTeamDPS(battle, 'c2', 3000, 200);
  const c3 = createEntityMonk(battle);
  battle.teams = [c3];
  battle.enemys = [createEnemyStake(battle)];
  battle.timeLimit = 300;
  battle.init();
  return battle;
}
