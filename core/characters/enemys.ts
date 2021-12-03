import { Battle, createEntity, IEntity, makeEffect } from '../common';
import { SHLog } from '../log';

export function createEnemyStake(battle: Battle): IEntity {
  const stake: IEntity = createEntity(battle, 'stake', {
    hpmax: 10000,
    apmax: 100,
    attack: 0,
    critRate: 0,
    critDamage: 0,
  });
  stake.onAttack = () => {};
  stake.onBehit = (effect) => {
    if (effect.damage) {
      if (stake.hp < 2000) {
        makeEffect(
          {
            caster: stake,
            target: stake,
            name: 'stakeHealSelf',
            heal: 5000,
          },
          -1
        );
      }
    }
  };
  return stake;
}

export function createEnemyBoss(battle: Battle): IEntity {
  const boss = createEntity(battle, 'boss', {
    hpmax: 100000,
    apmax: 100,
    attack: 0,
    critRate: 0,
    critDamage: 0,
  });
  boss.onAttack = () => {
    let target;
    for (let i = 0; i < battle.teams.length; i++) {
      if (battle.teams[i].isAlive) {
        target = battle.teams[i];
        break;
      }
    }
    if (target) {
      makeEffect({
        caster: boss,
        name: 'bossAttack',
        target,
        damage: 30,
      });
    }
  };
  return boss;
}
