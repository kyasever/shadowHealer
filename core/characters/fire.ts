/*
被动 回响 所有的输出都有20%几率重复释放一次
攻击力 80
技能A 火球 200% 伤害 cd3
技能B 冲击 150% 伤害 增加10能量 cd5
爆发 100能量 攻击力提升50 回响几率提升至30%, 持续10s  降低技能cd效果复杂度略高,先观望


装备
攻击时触发闪电链,对群(暂时单)伤害
攻击时触发充能
伤害提高10%
攻击速度提高15%
*/

import {
  IEntity,
  Battle,
  ISkill,
  makeEffect,
  IEffect,
  IBuff,
  IEntityProperty,
  createEntity,
} from '../common';

/*
  Alpha 感觉这个机制挺好的啊,如果dps模拟的结果没有改变,则说明代码的改动没有问题, 所有的改动都在这里记录下来 
  0.1 dps 299
  0.2 dps 241
    回响触发率降低到 20%
    优化回响逻辑
  0.3 dps 238
    真实的大招
    暴击机制
  0.31 230
    更改了ap增减机制, 修复了ap可以超过上限的问题(会降低大招的占比)
  0.4 190
    降低了大招伤害, 改变大招机制, 大招覆盖率26%
  0.5 286
    增加遗物

  TODO: 修改属性计算回调, oncalcu 只是返回增幅结果, 由管理器计算结论. 而不是直接操作对象
  buff的添加和叠加还需要优化
  makeeffect 应该从递归优化为队列, 顺序也可以保证了
  少加一点钩子, 用到了再加, 用不到尽可能删...
*/

export class CharacterWizzard implements IEntity {
  battle: Battle;
  name: string;
  isAlive: boolean;
  hp: number;
  ap: number;
  sheild: number;
  property: IEntityProperty;
  sheildMax?: number;
  attack?: number;
  hpmax?: number;
  apmax?: number;
  critRate?: number;
  critDamage?: number;
  buffs: { [key: string]: IBuff };
  onBehit?: (effect: IEffect) => void;
  onUpdate?: () => void;
  attackInterval?: number;
  attackRelease: number;
  skills?: ISkill[];
  onAttack?: () => void;

  constructor(battle) {
    createEntity(
      battle,
      {
        hpmax: 1000,
        apmax: 100,
        attack: 80,
        critRate: 0.2,
        critDamage: 2,
      },
      this
    );

    this.name = 'fire';
    this.skills = [this.skillFinal, this.skillB, this.skillA, this.skillNormal];
    this.buffs[this.itemLightning.name] = this.itemLightning;
    this.itemLightning.onAdd();
  }

  itemLightning: IBuff = {
    name: 'lightning',
    caster: this,
    target: this,
    onEffect: (effect) => {
      if (effect.target !== this) {
        // 增伤10%
        effect.damage *= 1.1;
        if (Math.random() < 0.2) {
          makeEffect({
            caster: this,
            name: 'lightning',
            target: effect.target,
            // 闪电链 攻击时触发
            damage: 20,
            // 充能 攻击时触发
            ap_caster: 2,
          });
        }
      }
    },
    onAdd: () => {
      // 攻速提升15%
      this.attackInterval *= 0.85;
    },
  };

  cycleChange = 0.2;

  onEffect = (effect: IEffect) => {
    if (effect.caster === this) {
      if (Math.random() < this.cycleChange) {
        let name = effect.name;
        if (!name.includes('cycle')) {
          name = `${effect.name}(cycle)`;
        }

        const newEffect: IEffect = {
          name,
          caster: effect.caster,
          target: effect.target,
        };
        if (effect.damage) {
          newEffect.damage = effect.damage * 0.8;
        }
        if (effect.ap_caster) {
          newEffect.ap_caster = effect.ap_caster;
        }

        makeEffect(newEffect);
      }
    }
  };

  skillNormal = {
    name: 'Normal',
    onUse: () => {
      makeEffect({
        caster: this,
        target: this.battle.enemys[0],
        damage: this.attack,
        name: 'Normal',
      });
    },
  };

  skillA = {
    name: 'A',
    cd: 3,
    onUse: () => {
      makeEffect({
        caster: this,
        target: this.battle.enemys[0],
        name: 'A',
        damage: this.attack,
      });
    },
  };

  skillB = {
    name: 'B',
    cd: 5,
    onUse: () => {
      makeEffect({
        caster: this,
        target: this.battle.enemys[0],
        name: 'B',
        damage: this.attack * 1.5,
        ap_caster: 10,
      });
    },
  };

  finalBuff: IBuff = {
    name: 'finalBuff',
    target: this,
    caster: this,
    release: 10,
    onCalculateProperty: (prop) => {
      prop.attack += 50;
    },
    onAdd: () => {
      this.cycleChange = 0.4;
    },
    onRemove: () => {
      this.cycleChange = 0.2;
    },
  };

  skillFinal = {
    name: 'Final',
    apNeed: 100,
    onUse: () => {
      makeEffect({
        caster: this,
        target: this.battle.enemys[0],
        name: 'Final',
        ap_caster: -this.apmax,
        damage: this.attack * 3,
        addBuff: { ...this.finalBuff },
      });
    },
  };
}
