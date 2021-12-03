import { Battle } from './battle';
import { IEffect } from './effect';
import { calculateProperty } from './property';

export * from './effect';
export * from './battle';
export * from './property';
export * from './utils';
export * from './skada';

export const GameConfig = {
  logLevel: 1,
  gameSpeed: 0,
};

export const DeltaTime: number = 0.02;
export const FrameCount: number = 50;

/**
  属性计算公式: (基础值 + 固定加成) * 百分比
  基础值和角色绑定,取决于角色模型,等级等.
  天赋 装备 buff等均通过回调方式结算.
  回调的参数是这个, 直接修改其中的值
  effect中的属性都是独立增伤
 */
export interface IEntityProperty {
  hpmax: number;
  hpmaxScale?: number;
  apmax: number;
  apmaxScale?: number;
  attack: number;
  attackScale?: number;
  critRate: number;
  critDamage: number;
  sheildMax?: number;
  attackInterval?: number;
}

// 返回一个默认的空Entity
export function createEntity(
  battle: Battle,
  property: IEntityProperty,
  entity?: any
): IEntity {
  if (!entity) {
    entity = {};
  }
  entity.battle = battle;
  entity.buffs = {};
  entity.property = property;
  calculateProperty(entity);
  entity.hp = entity.hpmax;
  entity.ap = entity.apmax;
  entity.sheild = 0;
  entity.isAlive = true;
  if (!entity.skills) {
    entity.skills = [];
  }
  if (!entity.attackInterval) {
    entity.attackInterval = 1;
  }
  entity.attackRelease = Math.random() * 1;
  return entity;
}

export interface IEntity {
  battle: Battle;
  // 基础属性
  name: string;
  isAlive: boolean;
  hp: number;
  ap: number;
  sheild: number;
  attackRelease: number;
  // 原始属性
  property: IEntityProperty;
  // 由calculateProperty赋值,不允许手动更改
  sheildMax?: number;
  attack?: number;
  hpmax?: number;
  apmax?: number;
  critRate?: number;
  critDamage?: number;
  attackInterval?: number;
  // buff & 生命周期
  buffs: { [key: string]: IBuff };
  onEffect?: (effect: IEffect) => void;
  onBehit?: (effect: IEffect) => void;
  afterEffect?: (effect: IEffect) => void;
  afterBehit?: (effect: IEffect) => void;
  // action & 生命周期
  // 模式1: 每帧精确控制做什么
  onUpdate?: () => void;
  // 模式2: 直到轮到自己行动时控制自己做什么

  /** 按照列表检索,顺序为优先级 */
  skills?: ISkill[];
  // 重载这个, 说明要求不高, 只在轮到attack时触发, 其他逻辑托管给系统
  onAttack?: () => void;
}

export interface ISkill {
  // caster 本质上是effect需要的, apcost也应该属于effect
  name: string;
  // apcost 应该属于effect, 这里加一个字段用于指示ai
  apNeed?: number;
  cd?: number;
  cdRelease?: number;
  onUse?: () => void;
}

export interface IBuff {
  name: string;
  target: IEntity;
  caster: IEntity;
  // 重复添加buff 取剩余时间更多的一个. undefined 表示无限持续
  release?: number;
  // 层数
  stack?: number;
  maxStack?: number;
  onEffect?: (effect: IEffect) => void;
  onBehit?: (effect: IEffect) => void;
  onCalculateProperty?: (property: IEntityProperty) => void;
  onAdd?: () => void;
  onRemove?: () => void;
}
