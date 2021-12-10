import { Battle, Entity, makeEffect } from '../battle';
import { DeltaTime } from '../game';
import { SHLog } from '../utils';

export function randomRange(min: number, max: number) {
  let dis = max - min;
  return min + Math.random() * dis;
}

export function createTeamDPS(
  battle: Battle,
  name: string,
  hp: number,
  attack: number
): Entity {
  const character: Entity = new Entity(battle, name, {
    hpmax: hp,
    apmax: 100,
    attack: attack,
    critRate: 0.2,
    critDamage: 2,
  });
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
export function createDead(battle): Entity {
  const character = createTeamDPS(battle, 'deadman', 3500, 50);
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

export function createRaven(battle): Entity {
  const character = createTeamDPS(battle, 'caller', 1000, 120);

  return character;
}
