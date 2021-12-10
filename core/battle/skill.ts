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
  // 原则上来讲应该等于onUse中实际的开销, 主要通过这个来指示一个技能是否可用
  ap_caster?: number;
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
