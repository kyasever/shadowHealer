import { IEntityProperty, IEffect } from '../battle';
import { characterData } from './characterData';

/** 角色数据类约束, 支持的字段可以自动解析,填错了会红线. 不支持的字段放在custom. 日后会支持更多机制 */
export interface IDataEntity {
  /** 角色名, 其他字段中指定一个角色也是通过这个名字找的 */
  name: string;
  /** 角色基础属性, xxxScale代表百分比加成 */
  property: IEntityProperty;
  /** skill需要的字段会默认放进skill, 如果没有custom, 则使用时只有一个effect, 如果有,则自定义 */
  skills?: (Partial<IEffect> & {
    /** 技能名, 索引项 */
    name: string;
    /** 释放这个技能对释放者ap产生的影响, eg: -15 为消耗15ap */
    ap_caster?: number;
    cd?: number;
    cdRelease?: number;
    /** 技能伤害倍率,最终伤害 = damageScale * property.attack */
    damageScale?: number;
    /** 需要手动解析的字段 */
    custom?: object;
  })[];
  /** buff目前都是手动解析的 */
  buffs?: {
    name: string;
    custom?: object;
  }[];
  /** ai控制的角色会根据这个字段,选择有限释放排在数组前面的技能 */
  skillPriority?: string[];
  /** 需要手动解析的字段 */
  custom?: object;
  [key: string]: any;
}

export function loadCharacterData(name: string) {
  return characterData[name];
}
