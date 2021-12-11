import { IDataEntity } from '@core/data';
import { Battle, createEntityFromData, Entity, makeEffect } from '../battle';
import { DeltaTime } from '../game';
import { randomRange, randomString, SHLog } from '../utils';

export function createTeamDPS(battle: Battle, data: IDataEntity): Entity {
  let dps = randomRange(100, 300);
  let _data: IDataEntity = data || {
    name: 'c_' + dps.toFixed(0),
    property: {
      hpmax: 1000,
      apmax: 100,
      attack: dps,
      critRate: 0.2,
      critDamage: 2,
    },
  };

  const character: Entity = createEntityFromData(battle, _data);
  character.on('attack', () => {
    const damage = character.attack * randomRange(0.8, 1.2);
    makeEffect({
      caster: character,
      name: `normal`,
      target: battle.enemys[0],
      damage,
    });
  });
  return character;
}

// deadman 亡灵武士, 死亡后10s复活, 恢复50%生命
export function createDead(battle, data): Entity {
  let _data: IDataEntity = data || {
    name: 'dead',
    property: {
      hpmax: 3500,
      apmax: 100,
      attack: 50,
      critRate: 0.2,
      critDamage: 2,
    },
  };

  const character = createEntityFromData(battle, _data);

  character.on('attack', () => {
    const damage = character.attack * randomRange(0.8, 1.2);
    makeEffect({
      caster: character,
      name: `normal`,
      target: battle.enemys[0],
      damage,
    });
  });

  let timeDeadth = 0;
  character.on('update', () => {
    if (!character.isAlive) {
      timeDeadth += DeltaTime;
      if (timeDeadth > 10) {
        timeDeadth = 0;
        character.isAlive = true;
        character.hp = 1;
        SHLog.info('deadman rebirth');
        makeEffect({
          caster: character,
          target: character,
          name: 'rebirth',
          heal: character.hpmax * 0.5,
        });
      }
    }
  });
  return character;
}
