import { EventEmitter } from 'events';
import { FunctionKeys, NonFunctionKeys } from 'utility-types';
import { DeltaTime } from '../game';
import { SHInterface, SHLog } from '../utils';
import { Battle } from './battle';
import { Buff } from './buff';
import { IEffect, makeEffect } from './efffect';
import { calculateProperty } from './property';
import { Skill } from './skill';

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

type EventType =
  | { event: 'effect'; param: IEffect }
  | { event: 'behit'; param: IEffect }
  | { event: 'afterEffect'; param: IEffect }
  | { event: 'afterBehit'; param: IEffect }
  | { event: 'update'; param: void }
  | { event: 'attack'; param: void }
  | { event: 'calculateProperty'; param: IEntityProperty };

export type IEntity = SHInterface<Entity>;

export class Entity {
  battle: Battle;
  // 基础属性
  name: string;
  isAlive: boolean;
  hp: number;
  ap: number;
  sheild: number;
  attackRelease: number;
  // ai和ui使用,决定目标
  target?: Entity;
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
  buffs: { [key: string]: Buff };
  custom: { [key: string]: any };
  /** 技能 */
  skills?: { [key: string]: Skill };
  /** 技能释放优先级, 默认AI */
  skillPriority?: string[];

  _eventEmitter: EventEmitter;

  constructor(battle: Battle, name, property) {
    this.battle = battle;
    this.name = name;
    this.property = property;
    this.hp = 1;
    this.ap = 1;
    this.sheild = 0;
    this.isAlive = true;
    this.target = battle.coreTarget;
    this.buffs = {};
    this.skills = {};
    this.attackRelease = Math.random();
    this._eventEmitter = new EventEmitter();
    this.custom = {};
    calculateProperty(this);
    this.hp = this.hpmax;
    this.ap = this.apmax;
  }

  on<T extends EventType['event']>(
    event: T,
    callback: (param?: Extract<EventType, { event: T }>['param']) => void
  ) {
    this._eventEmitter.on(event, callback);
  }

  emit<T extends EventType['event']>(
    event: T,
    param: Extract<EventType, { event: T }>['param']
  ) {
    this._eventEmitter.emit(event, param);
  }

  makeEffect(effect: IEffect) {
    if (!effect.caster) {
      effect.caster = this;
    }
    if (!effect.target) {
      effect.target = this;
    }
    makeEffect(effect);
  }

  changeHp(value: number): number {
    value = Math.round(value);
    let end = this.hp + value;
    if (end > this.hpmax) {
      end = this.hpmax;
    }
    if (end < 0) {
      end = 0;
      this.isAlive = false;
      Object.values(this.buffs).forEach((buff) => {
        this.makeEffect({
          target: this,
          name: 'dead',
          removeBuff: buff,
        });
      });
      SHLog.info(`${this.name} dead`);
    }
    const changed = end - this.hp;
    this.hp = end;
    return changed;
  }

  changeAp(value: number) {
    value = Math.round(value);
    let end = this.ap + value;
    if (end > this.apmax) {
      end = this.apmax;
    }
    if (end < 0) {
      end = 0;
    }
    const changed = end - this.ap;
    this.ap = end;
    return changed;
  }
}
