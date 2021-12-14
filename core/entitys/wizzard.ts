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
  dealSkillWithPriority,
  Buff,
  createEntityFromData,
  IEffect,
  makeEffect,
} from '../battle';
import { loadCharacterData } from '../data';

export function createEntityWizzard(battle) {
  const entity = createEntityFromData(battle, loadCharacterData('wizzard'));
  entity.useComponent(dealSkillWithPriority);

  entity.custom.cycleChange = 0.2;
  entity.on('effect', (effect) => {
    if (effect.caster === entity) {
      if (Math.random() < entity.custom.cycleChange) {
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
  });

  const skillFinal = entity.skills['final'];

  entity.buffCreater = {
    finalBuff: () => {
      const finalBuff: Buff = new Buff('finalBuff');
      finalBuff.release = 10;
      finalBuff.on('calculateProperty', (prop) => {
        prop.attack += 50;
      });
      finalBuff.on('add', () => {
        entity.custom.cycleChange = 0.4;
      });
      finalBuff.on('remove', () => {
        entity.custom.cycleChange = 0.2;
      });
      return finalBuff;
    },
  };

  skillFinal.on('use', () => {
    makeEffect({
      caster: entity,
      target: entity.target,
      name: 'Final',
      ap_caster: -entity.apmax,
      damage: entity.attack * 3,
    });
    makeEffect({
      caster: entity,
      target: entity,
      name: 'Final',
      addBuff: 'finalBuff',
    });
  });

  return entity;
}

// itemLightning: IBuff = {
//   name: 'lightning',
//   caster: entity,
//   target: entity,
//   onEffect: (effect) => {
//     if (effect.target !== entity) {
//       // 增伤10%
//       effect.damage *= 1.1;
//       if (Math.random() < 0.2) {
//         makeEffect({
//           caster: entity,
//           name: 'lightning',
//           target: effect.target,
//           // 闪电链 攻击时触发
//           damage: 20,
//           // 充能 攻击时触发
//           ap_caster: 2,
//         });
//       }
//     }
//   },
//   onAdd: () => {
//     // 攻速提升15%
//     entity.attackInterval *= 0.85;
//   },
// };
