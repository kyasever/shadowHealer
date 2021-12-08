import { Battle, DeltaTime, ISkill, makeEffect } from '.';
import { SHLog } from '../log';

export function updateCharacters(battle: Battle) {
  battle.characters.forEach((c) => {
    if (c.onUpdate) {
      c.onUpdate();
    }
    if (!c.isAlive) {
      return;
    }
    // buff结算
    Object.keys(c.buffs).forEach((key) => {
      const buff = c.buffs[key];
      if (buff.release) {
        buff.release -= DeltaTime;
        if (buff.release < 0) {
          makeEffect({
            caster: buff.caster,
            target: buff.target,
            name: 'buff-timeout',
            removeBuff: buff,
          });
        }
      }
    });
    battle.skada.addBuffData(c);

    if (!c.attackRelease) {
      return;
    }

    c.attackRelease -= DeltaTime;
    if (c.attackRelease <= 0) {
      c.attackRelease = c.attackInterval;
      c.onAttack && c.onAttack();
    }
  });
}
