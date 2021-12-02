import { IEntity, IEntityProperty } from '.';

// 在适当的时候触发, 重新计算角色的所有属性. 应当保证每次计算都可以获得相同的值,来保证可以随时重新计算
export function calculateProperty(c: IEntity) {
  const property: IEntityProperty = {
    hpmaxScale: 1,
    apmaxScale: 1,
    attackScale: 1,
    ...c.property,
  };
  // callback
  Object.values(c.buffs).forEach((buff) => {
    buff.onCalculateProperty && buff.onCalculateProperty(property);
  });
  c.hpmax = property.hpmax * property.hpmaxScale;
  c.apmax = property.apmax * property.apmaxScale;
  c.attack = property.attack * property.attackScale;
  c.sheildMax = property.sheildMax ? property.sheildMax : c.hpmax * 0.5;
  c.critRate = property.critRate;
  c.critDamage = property.critDamage;
}
