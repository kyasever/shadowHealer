import { SHInterface } from '@core/utils';
import { EventEmitter } from 'events';
import { IEffect } from '.';
import { Entity, IEntityProperty } from './entity';

// 可接收的事件类型
type EventType =
  | { event: 'effect'; param: IEffect }
  | { event: 'behit'; param: IEffect }
  | { event: 'calculateProperty'; param: IEntityProperty }
  | { event: 'add'; param: void }
  | { event: 'remove'; param: void };

export type IBuff = SHInterface<Buff>;

/** 作为addBuff的值时请注意每次都需要创建新的对象(例如将其作为函数的返回值来保证每次创建的都是新的) */
export class Buff {
  name: string;
  // addBuff时添加
  target?: Entity;
  caster?: Entity;
  // 这是一个动态添加的buff / 装备 / 天赋
  type: 'normal' | 'equip' | 'telent';
  // normal类型的走时间
  release?: number;
  // 层数, 添加时增加一层, 没有这个字段说明没有这个机制
  maxStack?: number;
  stack?: number;
  custom?: any;
  constructor(name) {
    this.name = name;
  }

  _eventEmitter: EventEmitter;

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
}
