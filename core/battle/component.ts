import { DeltaTime } from '@core/game';
import { Entity, makeEffect, Skill } from '.';
import { SHLog } from '../utils';

export function dealPlayerControl(entity: Entity) {
  entity.on('controlUseSkill', (event) => {
    if (!entity.skills[event]) {
      SHLog.error(`not inclued skill:${event}`);
    }
    const skill = entity.skills[event];
    if (skill.canUse()) {
      skill.emit('use', null);
      SHLog.info(`controlUseSkill: ${entity.name} used skill ${skill.name}`);
    }
  });
}

/** 根据skillPriority字段, 当触发attack事件时自动释放技能 */
export function dealSkillWithPriority(entity: Entity) {
  if (entity.skillPriority) {
    entity.on('attack', () => {
      entity.target = entity.target || entity.battle.coreTarget;
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
        if (skill.canUse()) {
          hasUsedSkill = true;
          skill.emit('use', null);
          SHLog.info(`${entity.name} used skill ${skill.name}`);
          break;
        }
      }
      if (!hasUsedSkill) {
        SHLog.error(`${entity.name} not have skill to use`);
      }
    });
  }
}

/** 结算buffRelease, 归0时移除buff */
export function dealBuff(entity: Entity) {
  entity.on('update', () => {
    if (entity.isAlive) {
      // buff结算
      Object.keys(entity.buffs).forEach((key) => {
        const buff = entity.buffs[key];
        if (buff.release) {
          buff.release -= DeltaTime;
          if (buff.release < 0) {
            makeEffect({
              caster: buff.caster,
              target: buff.target,
              name: 'buff-timeout',
              removeBuff: buff.name,
            });
          }
        }
      });
    }
  });
}

/** 结算attackRelease, 归0时重置并触发 attack 事件 */
export function dealAttack(entity: Entity) {
  entity.on('update', () => {
    if (entity.isAlive && entity.attackRelease) {
      entity.attackRelease -= DeltaTime;
      if (entity.attackRelease <= 0) {
        entity.attackRelease = entity.attackInterval;
        Object.values(entity.skills).forEach((skill) => {
          if (!skill.cdRelease) {
            skill.cdRelease = 0;
          }
          skill.cdRelease -= 1;
        });
        entity.emit('attack', null);
      }
    }
  });
}
