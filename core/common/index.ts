import { EventEmitter } from 'stream';
import { Battle } from './battle';
import { calculateProperty } from './property';

export * from './effect';
export * from './battle';
export * from './property';
export * from './utils';
export * from './skada';

export const GameConfig = {
  logLevel: 1,
  gameSpeed: 0.02,
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

export interface IEntity {
  battle: Battle;
  // 基础属性
  name: string;
  isAlive: boolean;
  hp: number;
  ap: number;
  sheild: number;
  attackRelease: number;
  // ai和ui使用,决定目标
  target?: IEntity;
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
  /** 事件分发器, 回调以后全靠这个分发了. */
  eventEmitter: EventEmitter;
  onEffect?: (effect: IEffect) => any;
  onBehit?: (effect: IEffect) => any;
  afterEffect?: (effect: IEffect) => any;
  afterBehit?: (effect: IEffect) => any;
  // action & 生命周期
  // 每帧触发
  onUpdate?: () => any;

  /** 技能 */
  skills?: { [key: string]: ISkill };
  /** 技能释放优先级, 默认AI */
  skillPriority?: string[];

  // 当attackRelease走完时触发
  onAttack?: () => any;

  [key: string]: any;
}

export interface ISkill {
  // caster 本质上是effect需要的, apcost也应该属于effect
  name: string;
  // 原则上来讲应该等于onUse中实际的开销, 主要通过这个来指示一个技能是否可用
  ap_caster?: number;
  cd?: number;
  cdRelease?: number;
  custom?: any;
  onUse?: () => any;
}

export interface IBuff {
  name: string;
  // 可以添加的时候增加, 反正自己也没权限加buff了.
  target?: IEntity;
  caster?: IEntity;
  // 重复添加buff 取剩余时间更多的一个. undefined 表示无限持续
  release?: number;
  // 层数
  stack?: number;
  maxStack?: number;
  // 是否是静态, 静态buff不可被驱散, 不走时间
  static?: boolean;
  onEffect?: (effect: IEffect) => any;
  onBehit?: (effect: IEffect) => any;
  onCalculateProperty?: (property: IEntityProperty) => any;
  onAdd?: () => any;
  onRemove?: () => any;
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
  // 对target造成治疗, 负治疗也会算作治疗,但不会致死
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
