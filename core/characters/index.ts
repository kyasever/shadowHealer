export * from './enemys';
export * from './fire';
export * from './teams';
export * from './monk';

import { SHLog } from '@core/log';
import axios from 'axios';
import {
  Battle,
  calculateProperty,
  IBuff,
  IEffect,
  IEntity,
  IEntityProperty,
  ISkill,
  makeEffect,
} from '../common';

/** 从本地资源文件中读取一个json */
export async function loadFromJson<T>(name: string): Promise<T> {
  const res = await axios({
    method: 'get',
    url: `./assets/data/${name}`,
  }).catch((error) => {
    console.error('get data failed', error);
  });

  if (res) {
    return res['data'] as T;
  }
  return null;
}

export interface IDataEntity {
  name: string;
  property: IEntityProperty;
  // skill需要的字段会默认放进skill, 如果没有custom, 则使用时只有一个effect, 如果有,则自定义
  // TODO: skills本身就应该用dic, 另外加入字段作为优先级. 取消onattack, 只保留技能
  skills?: (Partial<IEffect> &
    ISkill & { custom?: any; damageScale?: number })[];
  skillPriority?: string[];
  [key: string]: any;
}

// 创建一个默认空对象
export function createEntity(
  battle: Battle,
  name: string,
  property: IEntityProperty
): IEntity {
  const entity: IEntity = {
    battle,
    name,
    hp: 1,
    ap: 1,
    sheild: 0,
    property,
    isAlive: true,
    target: battle.coreTarget,
    buffs: {},
    skills: {},
    attackRelease: Math.random() * 1,
  };
  calculateProperty(entity);
  entity.hp = entity.hpmax;
  entity.ap = entity.apmax;
  return entity;
}

// 从data创建一个对象
export function createEntityFromData(battle, data: IDataEntity): IEntity {
  const entity = createEntity(battle, data.name, data.property);
  entity.skillPriority = data.skillPriority;
  if (data.skills) {
    data.skills.forEach((skillData) => {
      const skill: ISkill = {
        name: skillData.name,
        cd: skillData.cd,
        ap_caster: skillData.ap_caster,
        custom: skillData.custom,
      };

      // 标注custom就不帮忙创建了, 自己搞吧
      if (!skillData.custom) {
        skill.onUse = () => {
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
        };
      }
      entity.skills[skillData.name] = skill;
    });
  }

  if (entity.skillPriority) {
    entity.onAttack = () => {
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
          skill.onUse && skill.onUse();
          skill.cdRelease = skill.cd;
          SHLog.info(`${entity.name} used skill ${skill.name}`);
          break;
        }
      }
      if (!hasUsedSkill) {
        SHLog.error(`${entity.name} not have skill to use`);
      }
    };
  }
  return entity;
}

export function canUseSkill(entity: IEntity, skill: ISkill) {
  if (skill.ap_caster && entity.ap < -skill.ap_caster) {
    return false;
  }
  if (skill.cdRelease > 0) {
    return false;
  }
  return true;
}
