export * from './enemys';
export * from './fire';
export * from './teams';
export * from './monk';

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
          const damage =
            skillData.damage + entity.attack * skillData.damageScale;
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
  return entity;
}
