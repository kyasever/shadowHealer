import { CharacterFactory } from '@core/characters';
import { Battle, GameConfig } from '@core/common';

export function createBattle(): Battle {
  const battle = new Battle();
  const c1 = CharacterFactory.wizzard();
  const c2 = CharacterFactory.teamDPS('c2', 1000, 100);
  const c3 = CharacterFactory.teamDPS('c3', 1000, 130);
  const c4 = CharacterFactory.teamDPS('c4', 1000, 160);
  const c5 = CharacterFactory.teamDPS('c5', 1000, 190);
  battle.teams = [c1, c2, c3, c4, c5];
  battle.enemys = [CharacterFactory.enemyBoss()];
  battle.init();
  return battle;
}
