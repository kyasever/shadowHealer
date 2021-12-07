import { Battle, IEntity, IEntityProperty, ISkill } from '../common';
import { CharacterWizzard } from './fire';
import { createEnemyBoss, createEnemyStake } from './enemys';
import { createTeamDPS } from './teams';
import { SHLog } from '@core/log';

export * from './enemys';
export * from './fire';
export * from './teams';
export * from './monk';

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

export interface IDataEntity {
  name: string;
  property: IEntityProperty;
  skills: any;
  [key: string]: any;
}

let charactersData: { [key: string]: IDataEntity };
export function initCharacterData(data) {
  charactersData = data;
}

export function loadCharacterData(name: string): IDataEntity {
  if (!charactersData) {
    SHLog.error('not init data');
    return;
  }
  if (!charactersData[name]) {
    SHLog.error(`not froud ${name} in chaaracter.json`);
    return;
  }
  return charactersData[name];
}
