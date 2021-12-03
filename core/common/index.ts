import { Battle } from './battle';
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
  name: string,
  property: IEntityProperty,
  entity?: any
): IEntity {
  if (!entity) {
    entity = {};
  }
  entity.name = name;
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
  // 是否是静态, 静态buff不可被驱散, 不走时间
  static?: boolean;
  onEffect?: (effect: IEffect) => void;
  onBehit?: (effect: IEffect) => void;
  onCalculateProperty?: (property: IEntityProperty) => void;
  onAdd?: () => void;
  onRemove?: () => void;
}

/*
 * makeEffect 核心函数: 所有的数据操作都要走effect
 */
export interface IEffect {
  // 记录中的名字
  name: string;
  // 释放者
  caster: IEntity;
  // 目标, 每个effect结算一个目标
  target: IEntity;

  // 默认暴击率取caster
  critRate?: number;
  critDamage?: number;
  isCrit?: boolean;

  // 对target造成伤害(相对于hp变化取反)
  damage?: number;
  // 对target造成治疗
  heal?: number;
  // 对caster改变ap
  ap_caster?: number;
  // 对target改变ap
  ap_target?: number;
  // 对target施加buff
  addBuff?: IBuff;
  // 移除
  removeBuff?: IBuff;
  // 对battle增加实体
  addEntity?: IEntity;

  // 每一步回调和处理,在这里记录日志
  logs?: string[];

  // 预期结算时间, 默认为now
  time?: number;
}
