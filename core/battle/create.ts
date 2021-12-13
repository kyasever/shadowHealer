import { Battle, Skill, makeEffect, IEntity } from '.';
import { IDataEntity } from '../data';
import { SHLog } from '../utils';
import { Entity } from './entity';

// 从data创建一个对象
export function createEntityFromData(battle, data: IDataEntity): Entity {
  if (!data) {
    SHLog.error(`未传入data,无法创建`);
    return null;
  }

  const entity = new Entity(battle, data.name, data.property);

  entity.skillPriority = data.skillPriority;

  if (data.skills) {
    data.skills.forEach((skillData) => {
      const skill = new Skill(skillData.name);
      skill.cd = skillData.cd;
      skill.custom = skillData.custom;

      skill.on('canUse', () => {
        if (entity.ap < -skillData.ap_caster) {
          return false;
        }
        if (skill.cdRelease > 0) {
          return false;
        }
        return true;
      });

      // 标注custom就不帮忙创建了, 自己搞吧
      if (!skillData.custom) {
        skill.on('use', () => {
          let damage = 0;
          if (skillData.damageScale) {
            damage += entity.attack * skillData.damageScale;
          }
          if (skillData.damage) {
            damage += skillData.damage;
          }
          makeEffect({
            caster: entity,
            target: entity.target,
            name: skillData.name,
            ap_caster: skillData.ap_caster,
            damage,
          });
        });
      }
      entity.skills[skillData.name] = skill;
    });
  }

  return entity;
}
