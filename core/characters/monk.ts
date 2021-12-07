import { SHLog } from '@core/log';
import { EFAULT } from 'constants';
import { loadCharacterData } from '.';
import { createEntity, Battle, makeEffect, IBuff } from '../common';

export function createEntityMonk(battle: Battle) {
  const monkData = loadCharacterData('monk');
  const entity = createEntity(battle, monkData.name, {
    ...monkData.property,
  });

  let cantAttack = 0;

  const skills = monkData.skills.map((skillData) => {
    if (skillData.custom?.type !== 'custom') {
      return {
        ...skillData,
        apNeed: -skillData.ap_caster,
        onUse: () => {
          makeEffect({
            caster: entity,
            target: battle.enemys[0],
            name: skillData.name,
            ap_caster: skillData.ap_caster,
            damage: skillData.custom.damage,
          });
        },
      };
      //技能5 30cd 免疫所有伤害，不能攻击持续7s,获得5能量/s。
    } else if (skillData.name === 'skill5') {
      entity.onEffect = () => {
        if (cantAttack > 0) {
          cantAttack--;
          makeEffect({
            caster: entity,
            target: entity,
            name: '打坐',
            ap_caster: skillData.custom.ap_caster,
          });
          SHLog.info('monk cant attack called');
          return 'reject';
        } else {
          return;
        }
      };
      return {
        ...skillData,
        onUse: () => {
          cantAttack = skillData.custom.during;
        },
      };
      //技能6 75cd 获得100能量和50能量上限，持续15s。失去最大生命值的30%，不会致死。
    } else if (skillData.name === 'skill6') {
      const buff: IBuff = {
        name: skillData.name,
        target: entity,
        caster: entity,
        release: skillData.custom.duiring,
        onCalculateProperty: (property) => {
          property.apmax += 100;
        },
      };
      return {
        ...skillData,
        onUse: () => {
          makeEffect({
            name: skillData.name,
            target: entity,
            caster: entity,
            ap_caster: 50,
            heal: -entity.hpmax * 0.3,
            addBuff: buff,
          });
        },
      };
    } else {
      SHLog.error(`json format wrong: ${skillData.name}`);
    }
  });

  const skill_map = {};
  skills.forEach((skill) => {
    skill_map[skill.name] = skill;
  });

  entity.skills = monkData.skillPriority.map((key) => {
    if (skill_map[key]) {
      return skill_map[key];
    } else {
      SHLog.error(`json [skillPriority] format wrong: ${key}`);
    }
  });

  return entity;
}
