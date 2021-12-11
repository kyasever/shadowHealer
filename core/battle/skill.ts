import { SHInterface } from '@core/utils';
import { EventEmitter } from 'events';
import { Callback } from 'vant/lib/lazyload/vue-lazyload';

type EventType =
  | { event: 'use'; param: void }
  | { event: 'canUse'; param: void };

export type ISkill = SHInterface<Skill>;
export class Skill {
  // caster 本质上是effect需要的, apcost也应该属于effect
  name: string;
  cd?: number;
  cdRelease?: number;
  custom?: any;

  constructor(name) {
    this.name = name;
    this._eventEmitter = new EventEmitter();
  }

  _eventEmitter: EventEmitter;

  on<T extends EventType['event']>(
    event: T,
    callback: (param?: Extract<EventType, { event: T }>['param']) => any
  ) {
    this._eventEmitter.on(event, callback);
  }

  emit<T extends EventType['event']>(
    event: T,
    param: Extract<EventType, { event: T }>['param']
  ) {
    this._eventEmitter.emit(event, param);
  }

  // 调用canUse的所有监听, 监听返回结果均为true 则返回true
  canUse() {
    const functions = this._eventEmitter.listeners('canUse');
    let canUse = true;
    functions.forEach((f) => {
      if (f() === false) {
        canUse = false;
      }
    });
    return canUse;
  }
}
