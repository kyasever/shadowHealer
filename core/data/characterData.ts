import { IDataEntity } from '.';

// 得益于typescript优秀的类型提示, 鼠标放上去有注释, 写错了有红线. custom中字段的解析逻辑位于对应的monk.ts
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
    skillPriority: ['skill6', 'skill5', 'skill3', 'skill4', 'skill2', 'skill1'],
    skills: [
      {
        name: 'skill1',
        ap_caster: 15,
        cd: 0,
        damage: 100,
      },
      {
        name: 'skill2',
        ap_caster: -25,
        cd: 0,
        damage: 1300,
      },
      {
        name: 'skill3',
        ap_caster: -40,
        cd: 15,
        damage: 2500,
      },
      {
        name: 'skill4',
        ap_caster: 8,
        cd: 3,
        damage: 550,
      },
      {
        name: 'skill5',
        cd: 30,
        custom: {
          during: 4,
          ap_caster: 10,
        },
      },
      {
        name: 'skill6',
        cd: 75,
        addBuff: 'finalBuff',
        custom: {
          hp_cost_max: 0.3,
          apmax: 100,
          during: 15,
        },
      },
    ],
    buffs: [
      {
        name: 'finalBuff',
        custom: {
          ap_max: 100,
        },
      },
    ],
  },
  wizzard: {
    name: 'wizzard',
    property: {
      hpmax: 1000,
      apmax: 100,
      attack: 80,
      critRate: 0.2,
      critDamage: 2,
    },
    skillPriority: ['final', 'B', 'A', 'normal'],
    skills: [
      {
        name: 'normal',
        damageScale: 1,
      },
      {
        name: 'A',
        damageScale: 2,
        cd: 3,
      },
      {
        name: 'B',
        damageScale: 1.5,
        ap_caster: 10,
        cd: 5,
      },
      {
        name: 'final',
        ap_caster: -100,
        damageScale: 3,
        custom: {},
      },
    ],
  },
};
