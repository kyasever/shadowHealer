import { IEntityProperty } from '../common';
export interface IDataEntity {
  name: string;
  property: IEntityProperty;
  skills: any;
  [key: string]: any;
}

/** 用ts代替了原来的json以便享受ts的类型定义,但是要注意, 此文件只记录关键属性, 必须可序列化
 * 此外有标准字段和自定义字段, 标准字段可以直接由标准函数解读, 自定义部分再交给自定义处理
 */
export const characterData: { [key: string]: IDataEntity } = {
  monk: {
    name: 'monk',
    property: {
      hpmax: 5000,
      apmax: 50,
      attack: 100,
      critRate: 0,
      critDamage: 2,
      attackInterval: 1.5,
    },
    skillPriority: ['skill6', 'skill3', 'skill4', 'skill5', 'skill2', 'skill1'],
    skills: [
      {
        name: 'skill1',
        ap_caster: 15,
        cd: 0,
        custom: {
          damage: 100,
        },
      },
      {
        name: 'skill2',
        ap_caster: -25,
        cd: 0,
        custom: {
          damage: 1300,
        },
      },
      {
        name: 'skill3',
        ap_caster: -40,
        cd: 15,
        custom: {
          damage: 2500,
        },
      },
      {
        name: 'skill4',
        ap_caster: 8,
        cd: 3,
        custom: {
          damage: 550,
        },
      },
      {
        name: 'skill5',
        cd: 30,
        custom: {
          type: 'custom',
          during: 4,
          ap_caster: 10,
        },
      },
      {
        name: 'skill6',
        cd: 75,
        custom: {
          type: 'custom',
          hp_cost_max: 0.3,
          apmax: 100,
          during: 15,
        },
      },
    ],
  },
};
