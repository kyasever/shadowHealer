import { SHLog } from '@core/log';
import {
  Battle,
  createEntity,
  DeltaTime,
  IEntity,
  makeEffect,
  MakeEffectInstance,
} from '../common';
import { randomRange } from '../common/utils';

export function createTeamDPS(
  battle: Battle,
  name: string,
  hp: number,
  attack: number
): IEntity {
  const character: IEntity = createEntity(battle, name, {
    hpmax: hp,
    apmax: 100,
    attack: attack,
    critRate: 0.2,
    critDamage: 2,
  });
  character.onAttack = () => {
    const damage = character.attack * randomRange(0.8, 1.2);
    makeEffect({
      caster: character,
      name: `normal`,
      target: battle.enemys[0],
      damage,
    });
  };
  return character;
}

// deadman 亡灵武士, 死亡后10s复活, 恢复50%生命
export function createDead(battle): IEntity {
  const character = createTeamDPS(battle, 'deadman', 3500, 50);
  let timeDeadth = 0;
  character.onUpdate = () => {
    if (!character.isAlive) {
      timeDeadth += DeltaTime;
      if (timeDeadth > 10) {
        timeDeadth = 0;
        character.isAlive = true;
        character.hp = 1;
        SHLog.info('deadman rebirth');
        makeEffect(
          {
            caster: character,
            target: character,
            name: 'rebirth',
            heal: character.hpmax * 0.5,
          },
          MakeEffectInstance
        );
      }
    }
  };
  return character;
}

export function createRaven(battle): IEntity {
  const character = createTeamDPS(battle, 'caller', 1000, 120);

  return character;
}
