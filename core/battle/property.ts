// 在适当的时候触发, 重新计算角色的所有属性. 应当保证每次计算都可以获得相同的值,来保证可以随时重新计算
// 属性计算期间的计算是在一个乘法区间的, 所有buff的即时计算是单独乘区的

import { Entity, IEntityProperty } from './entity';

// TODO: 根据变化原则等比例回复 / 减少生命
export function calculateProperty(c: Entity) {
  const property: IEntityProperty = {
    hpmaxScale: 1,
    apmaxScale: 1,
    attackScale: 1,
    attackInterval: 1,
    ...c.property,
  };
  c.emit('calculateProperty', property);
  Object.values(c.buffs).forEach((buff) => {
    buff.emit('calculateProperty', property);
  });
  c.hpmax = property.hpmax * property.hpmaxScale;
  c.apmax = property.apmax * property.apmaxScale;
  c.attack = property.attack * property.attackScale;
  c.sheildMax = property.sheildMax ? property.sheildMax : c.hpmax * 0.5;
  c.critRate = property.critRate;
  c.critDamage = property.critDamage;
  c.attackInterval = property.attackInterval;
}
