import { Battle, Skill, makeEffect } from '.';
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
      skill.ap_caster = skillData.ap_caster;
      skill.custom = skillData.custom;

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

  if (entity.skillPriority) {
    entity.on('attack', () => {
      entity.target = entity.battle.coreTarget;
      let hasUsedSkill = false;
      for (let i = 0; i < entity.skillPriority.length; i++) {
        const skill = entity.skills[entity.skillPriority[i]];
        if (!skill) {
          SHLog.error(
            `skillPriority not inclued skill:${entity.skillPriority[i]}`,
            skill
          );
          break;
        }
        if (canUseSkill(entity, skill)) {
          hasUsedSkill = true;
          skill.emit('use', null);
          skill.cdRelease = skill.cd;
          SHLog.info(`${entity.name} used skill ${skill.name}`);
          break;
        }
      }
      if (!hasUsedSkill) {
        SHLog.error(`${entity.name} not have skill to use`);
      }
    });
  }
  return entity;
}

export function canUseSkill(entity: Entity, skill: Skill) {
  if (skill.ap_caster && entity.ap < -skill.ap_caster) {
    return false;
  }
  if (skill.cdRelease > 0) {
    return false;
  }
  return true;
}
