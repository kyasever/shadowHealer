import { DeltaTime } from '../game';
import { SHLog } from '../utils';
import { Battle } from './battle';
import { IEffect } from './efffect';
import { Entity } from './entity';

/** 和一般对象不同的地方在于, 初始化的时候指定了一个空默认值, 从而get不会取空 */
export class SHMap<T> {
  _getDefault;

  constructor(_getEmpty: () => T) {
    this._getDefault = _getEmpty;
  }

  get(key: string): T {
    if (!this[key]) {
      this[key] = this._getDefault();
    }
    return this[key];
  }

  set(key: string, value: T) {
    this[key] = value;
  }

  delete(key: string) {
    delete this[key];
  }

  forEach(callback: (key: string, value: T) => void) {
    Object.keys(this).forEach((key) => {
      if (key !== '_getDefault') {
        callback(key, this[key]);
      }
    });
  }
}

interface SkadaData {
  totalDamage: number;
  dps: number;
  totalHeal: number;
  detail: SHMap<{
    totalDamage: number;
    totalHeal: number;
    count: 0;
    distribution: SHMap<number>;
  }>;
  buffCoverage: SHMap<{
    totalTime: number;
  }>;
}

export class Skada {
  battle: Battle;
  static instance: Skada;
  constructor(battle: Battle) {
    Skada.instance = this;
    this.battle = battle;

    this.data = new SHMap(() => {
      return {
        totalHeal: 0,
        totalDamage: 0,
        dps: 0,
        detail: new SHMap(() => {
          return {
            totalDamage: 0,
            count: 0,
            totalHeal: 0,
            distribution: new SHMap(() => 0),
          };
        }),
        buffCoverage: new SHMap(() => {
          return {
            totalTime: 0,
          };
        }),
      };
    });
  }

  // characterName:  { total, dps , skillRedord}
  data: SHMap<SkadaData>;

  addRecord(effect: IEffect) {
    const { caster, target, name } = effect;
    const damage: number = effect.damage || 0;
    const heal: number = effect.heal || 0;

    let c = this.data.get(caster.name);
    c.totalDamage += damage;
    c.totalHeal += heal;
    c.dps = c.totalDamage / caster.battle.time;

    const cn = c.detail.get(name);
    cn.totalDamage += damage;
    cn.totalHeal += heal;
    cn.count++;
    const dmgStr = damage.toString();
    cn.distribution[dmgStr] = cn.distribution.get(dmgStr) + 1;

    const critmsg = effect.isCrit ? '(crit)' : '';
    let dealmsg = 'null';
    if (damage > 0) {
      dealmsg = `deal [${damage}]${critmsg} damage`;
    }
    if (heal > 0) {
      dealmsg = `heal [${heal}]${critmsg} hp`;
    }
    const timemsg = `[${caster.battle.time.toFixed(2)}]`;
    const castermsg = `[${caster.name}](${caster.ap}/${caster.apmax})`;
    const targetmsg = `[${target.name}(${target.hp}/${target.hpmax})]`;
    SHLog.log(`${timemsg}${castermsg} use ${name} to ${targetmsg} ${dealmsg}`);
  }

  // 每帧记录, 如果有这个buff,则count + 1最终得出buff覆盖率
  addBuffData(c: Entity) {
    Object.keys(c.buffs).forEach((key) => {
      let b = this.data.get(c.name).buffCoverage;
      if (!b[c.buffs[key].name]) {
        b[c.buffs[key].name] = { totalTime: 0 };
      }
      b[c.buffs[key].name].totalTime += DeltaTime;
    });
  }

  getEntityDetails(target?: string) {
    if (!target) {
      target = this.battle.teams[0].name;
    }

    // 伤害详情
    console.log('damege detail:');

    const { totalDamage: total, detail, buffCoverage } = this.data.get(target);
    if (detail) {
      const sortedData = [];
      detail.forEach((key, value) => {
        sortedData.push({
          name: key,
          totalDamage: value.totalDamage,
          count: value.count,
          average: (value.totalDamage / value.count).toFixed(2),
          proportion: ((value.totalDamage / total) * 100).toFixed(2) + '%',
          distribution: value.distribution,
        });
        sortedData.sort((a, b) => {
          return b.totalDamage - a.totalDamage;
        });
      });
      console.table(sortedData);
    }

    // buff覆盖率
    console.log('buff coverage:');
    if (buffCoverage) {
      const sortedBuff = [];
      buffCoverage.forEach((key, value) => {
        sortedBuff.push({
          name: key,
          total: value.totalTime.toFixed(2),
          proportion:
            ((value.totalTime / this.battle.time) * 100).toFixed(2) + '%',
        });
      });
      console.table(sortedBuff);
    }
  }

  calculateResult(type: 'totalDamage' | 'dps' | 'totalHeal') {
    let select = [];
    let max = 0;
    this.data.forEach((name, data) => {
      if (typeof data[type] === 'undefined') {
        SHLog.error('不支持的type', type, data);
        return;
      }
      if (data[type] > max) {
        max = data[type];
      }
      select.push({
        name,
        source_value: data[type],
        value: data[type].toFixed(1),
        percent: 0,
      });
    });

    select = select.map((item) => {
      let percent = max === 0 ? 0 : (item.source_value / max) * 100;

      return {
        name: item.name,
        value: item.value,
        source_value: item.source_value,
        percent,
      };
    });

    select = select.sort((a, b) => {
      return b.source_value - a.source_value;
    });

    return select;
  }
}
