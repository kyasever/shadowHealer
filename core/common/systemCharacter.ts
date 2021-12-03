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

      c.skills.forEach((skill) => {
        if (skill.cdRelease === undefined) {
          skill.cdRelease = 0;
        }
        skill.cdRelease -= 1;
      });

      if (c.onAttack) {
        c.onAttack();
      }

      if (c.skills.length === 0) {
        return;
      }
      let s: ISkill;
      for (let i = 0; i < c.skills.length; i++) {
        s = c.skills[i];
        // 存在ap限制, 且ap不足
        if (s.apNeed && c.ap < s.apNeed) {
          continue;
        }
        // 存在cd 且 cd没好
        if (s.cd && s.cdRelease > 0) {
          continue;
        }
        // 符合条件, 跳出检测
        break;
      }

      if (!s) {
        SHLog.warn(`character ${c.name} have none skill to use`);
        return;
      }

      if (s.cd) {
        s.cdRelease = s.cd;
      }
      SHLog.debug(`character ${c.name} use ${s.name}`);
      s.onUse();
    }
  });
}
