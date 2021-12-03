import {
  DeltaTime,
  IEntity,
  IEffect,
  makeEffect,
  Skada,
  _dealEffect,
  FrameCount,
  GameConfig,
} from '.';
import { updateCharacters } from './systemCharacter';
import { wait } from './utils';
import { SHLog } from '../log';
import { CharacterFactory } from '../characters';
export class Battle {
  /** 所有场上存活的character, 引用可以保存在多个不同的容器里 */
  characters: IEntity[] = [];

  /** 按照站位排列的己方单位 */
  teams: IEntity[] = [];

  // 敌人
  enemys: IEntity[] = [];

  time: number = 0;

  timeLimit: number;

  skada: Skada;

  gameSpeed: number;

  // 每帧末要处理的effect
  effectToCall: IEffect[] = [];
  effectCalled: IEffect[] = [];
  // 默认 undefined 有值代表有结果了
  gameResult;

  constructor() {
    this.skada = new Skada(this);
    CharacterFactory.battle = this;
  }

  init() {
    this.characters = [...this.teams, ...this.enemys];
  }

  async start() {
    while (true) {
      // =0 说明不需要间隔,最快速度跑帧
      if (GameConfig.gameSpeed === 0) {
      }
      // >0 说明是正常的时间间隔, 每间隔走一帧
      else if (GameConfig.gameSpeed > 0) {
        await wait(GameConfig.gameSpeed * 1000);
      }
      // <0 说明暂停了
      else {
        SHLog.info('game paused');
        while (true) {
          if (GameConfig.gameSpeed < 0) {
            await wait(1000);
          } else {
            SHLog.info('game continue');
            break;
          }
        }
      }

      this.update();
      this._updateCallBack && this._updateCallBack();
      if (this.gameResult) {
        break;
      }
    }
    this.outputField();
  }

  _updateCallBack: () => void;
  onUpdate(callback) {
    this._updateCallBack = callback;
  }

  // 每帧一次
  update() {
    this.time += DeltaTime;
    updateCharacters(this);
    // update Effects
    let dealCount = 0;

    if (this.effectToCall.length > 0) {
      for (let i = 0; i < this.effectToCall.length; i++) {
        const effect = this.effectToCall[i];
        _dealEffect(effect);
        this.effectCalled.push(effect);
      }
      this.effectToCall = [];
    }

    if (dealCount > 0) {
      SHLog.debug(`deal effect count: ${dealCount}`);
    }
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
    this.characters.forEach((c) => {
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
