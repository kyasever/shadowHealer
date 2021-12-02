import { Battle, IEntity } from '../common';
import { CharacterWizzard } from './fire';
import { createEnemyBoss, createEnemyStake } from './enemys';
import { createTeamDPS } from './teams';

export class CharacterFactory {
  static battle: Battle;

  static wizzard(): IEntity {
    return new CharacterWizzard(this.battle);
  }

  static enemyStake(): IEntity {
    return createEnemyStake(this.battle);
  }

  static enemyBoss(): IEntity {
    return createEnemyBoss(this.battle);
  }

  static teamDPS(name: string, hp: number, dps: number): IEntity {
    return createTeamDPS(this.battle, name, hp, dps);
  }
}
