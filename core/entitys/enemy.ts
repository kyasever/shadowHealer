import { Battle, Entity, makeEffect } from '../battle';

export function createEnemyStake(battle: Battle): Entity {
  const stake: Entity = new Entity(battle, 'stake', {
    hpmax: 100000,
    apmax: 100,
    attack: 0,
    critRate: 0,
    critDamage: 0,
  });
  stake.on('behit', (effect) => {
    if (effect.damage) {
      if (stake.hp < stake.hpmax * 0.5) {
        makeEffect({
          caster: stake,
          target: stake,
          name: 'stakeHealSelf',
          heal: 5000,
        });
      }
    }
  });
  return stake;
}

export function createEnemyBoss(battle: Battle): Entity {
  const boss = new Entity(battle, 'boss', {
    hpmax: 100000,
    apmax: 100,
    attack: 0,
    critRate: 0,
    critDamage: 0,
  });
  boss.on('attack', () => {
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
  });
  return boss;
}
