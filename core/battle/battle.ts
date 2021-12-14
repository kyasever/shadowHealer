import { EventEmitter } from 'events';
import { DeltaTime, FrameCount, GameConfig } from '../game';
import { SHInterface, SHLog, wait } from '../utils';
import { makeEffect } from './efffect';
import { Entity } from './entity';
import { Skada } from './skada';

type EventType =
  | { event: 'init'; param: void }
  | { event: 'update'; param: void }
  | { event: 'perSecond'; param: void }
  | { event: 'end'; param: void }
  | { event: 'stop'; param: string }
  | { event: 'selectEntity'; param: string };

export type IBattle = SHInterface<Battle>;

/**
 * 生命周期
 * 监听:
 *  init: 调用battle.start时立即触发
 *  update: 每帧触发,触发50次为逻辑上一秒
 *  perSecond: 每秒触发(50帧一次)
 *  end: 结束后触发
 * 触发:
 *  stop: 终止游戏
 *  selectEntity: 玩家角色选择一个目标
 */
export class Battle {
  /** 所有场上存活的character, 引用可以保存在多个不同的容器里 */
  entitys: Entity[];
  /** 按照站位排列的己方单位 */
  teams: Entity[] = [];
  // 敌人
  enemys: Entity[] = [];

  // 玩家操作角色
  player: Entity;
  // 主要目标
  coreTarget: Entity;

  time: number = 0;
  timeLimit: number = 900;
  skada: Skada;

  // 默认 undefined 有值代表有结果了
  gameResult: string;

  FPSTimeStart = 0;
  FPSCount = 0;
  FPS: number = 0;

  _eventEmitter: EventEmitter;
  constructor() {
    this.skada = new Skada(this);
    this._eventEmitter = new EventEmitter();
    this.on('update', () => {
      this.update();
    });

    this.on('perSecond', () => {
      // 实际每帧用时ms: (new Date().getTime() - this.FPSTimeStart) / 50
      this.FPS = (1000 / (new Date().getTime() - this.FPSTimeStart)) * 50;
      this.FPSTimeStart = new Date().getTime();
    });

    this.on('selectEntity', (name) => {
      this.entitys.forEach((entity) => {
        if (entity.name === name) {
          entity.isSelected = true;
          this.player.target = entity;
        } else {
          entity.isSelected = false;
        }
      });
    });
  }

  init() {
    this.entitys = [...this.teams, ...this.enemys];
    this.coreTarget = this.coreTarget || this.enemys[0];
    this.player = this.player || this.entitys[0];
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

  async run() {
    this.emit('init', null);
    let isContinue = true;
    this.on('stop', (value) => {
      isContinue = false;
      this.gameResult = value;
    });
    while (isContinue) {
      // =0 说明不需要间隔,最快速度跑帧
      if (GameConfig.speed === 0) {
      }
      // >0 说明是正常的时间间隔, 每间隔走一帧
      else if (GameConfig.speed > 0) {
        await wait(GameConfig.speed * 1000);
      }
      // <0 说明暂停了
      else {
        SHLog.info('game paused');
        while (true) {
          if (GameConfig.speed < 0) {
            await wait(1000);
          } else {
            SHLog.info('game continue');
            break;
          }
        }
      }

      // 每50帧统计一次, 计算实际每秒运行了多少帧
      this.FPSCount++;
      if (this.FPSCount >= FrameCount) {
        this.FPSCount = 0;
        this.emit('perSecond', null);
      }

      this._eventEmitter.emit('update');
    }
    this.outputField();
    this.emit('end', null);
  }

  // 每帧一次
  update() {
    this.time += DeltaTime;

    this.entitys.forEach((entity) => {
      entity.emit('update', null);
      if (entity.isAlive) {
        this.skada.addBuffData(entity);
      }
    });

    // 检查是否要结束战斗
    if (this.teams.filter((c) => c.isAlive).length === 0) {
      this.emit('stop', 'fail');
    }
    if (this.enemys.filter((c) => c.isAlive).length === 0) {
      this.emit('stop', 'success');
    }
    if (this.timeLimit && this.time > this.timeLimit) {
      this.emit('stop', 'timeout');
    }
  }

  outputField() {
    SHLog.info(`battle ${this.gameResult}, time: ${this.time}`);
    // 输出战场情况
    const tt = [];
    this.entitys.forEach((c) => {
      tt.push({
        name: c.name,
        hp: `${c.hp}/${c.hpmax}`,
        alive: c.isAlive,
        nextAttack: c.attackRelease.toFixed(2) + 's',
      });
    });
    SHLog.table(tt, 5);
  }
}
