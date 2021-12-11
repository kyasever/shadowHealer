import { EventEmitter } from 'events';
import { DeltaTime, FrameCount, GameConfig } from '../game';
import { SHInterface, SHLog, wait } from '../utils';
import { makeEffect } from './efffect';
import { Entity } from './entity';
import { Skada } from './skada';

type EventType =
  | { event: 'init'; param: void }
  | { event: 'update'; param: void }
  | { event: 'end'; param: void };

export type IBattle = SHInterface<Battle>;

export class Battle {
  /** 所有场上存活的character, 引用可以保存在多个不同的容器里 */
  entitys: Entity[];
  /** 按照站位排列的己方单位 */
  teams: Entity[] = [];
  // 敌人
  enemys: Entity[] = [];
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
  }

  init() {
    this.entitys = [...this.teams, ...this.enemys];
    this.coreTarget = this.enemys[0];
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

  async start() {
    this.emit('init', null);
    while (true) {
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
        // 实际每帧用时ms: (new Date().getTime() - this.FPSTimeStart) / 50
        this.FPS = (1000 / (new Date().getTime() - this.FPSTimeStart)) * 50;
        this.FPSTimeStart = new Date().getTime();
      }

      this._eventEmitter.emit('update');

      if (this.gameResult) {
        break;
      }
    }
    this.outputField();
  }

  // 每帧一次
  update() {
    this.time += DeltaTime;
    updateCharacters(this);

    // 检查是否要结束战斗
    if (this.teams.filter((c) => c.isAlive).length === 0) {
      this.gameResult = 'fail';
    }
    if (this.enemys.filter((c) => c.isAlive).length === 0) {
      this.gameResult = 'success';
    }
    if (this.timeLimit && this.time > this.timeLimit) {
      this.gameResult = 'timeout';
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
    SHLog.table(tt, 3);
  }
}

function updateCharacters(battle: Battle) {
  battle.entitys.forEach((entity) => {
    entity.emit('update', null);

    if (!entity.isAlive) {
      return;
    }
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

    battle.skada.addBuffData(entity);

    if (!entity.attackRelease) {
      return;
    }

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
  });
}
