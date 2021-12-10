import { Battle, Buff, createEntityFromData, makeEffect } from '../battle';
import { getCharacterData } from '../data';
import { SHLog } from '../utils';

export function createEntityMonk(battle: Battle) {
  const monkData = getCharacterData['monk'];
  const entity = createEntityFromData(battle, monkData);

  let cantAttack = 0;

  const skill5 = entity.skills['skill5'];

  entity.on('effect', () => {
    if (cantAttack > 0) {
      cantAttack--;
      makeEffect({
        caster: entity,
        target: entity,
        name: skill5.name,
        ap_caster: skill5.custom.ap_caster,
      });
      SHLog.info('monk cant attack called');
      return 'reject';
    } else {
      return;
    }
  });

  skill5.on('use', () => {
    cantAttack = skill5.custom.during;
  });

  const skill6 = entity.skills['skill6'];

  const buff: Buff = new Buff(skill6.name);
  buff.release = skill6.custom.duiring;
  buff.on('calculateProperty', (property) => {
    property.apmax += 100;
  });

  skill6.on('use', () => {
    makeEffect({
      name: skill6.name,
      target: entity,
      caster: entity,
      ap_caster: 50,
      heal: -entity.hpmax * 0.3,
      addBuff: buff,
    });
  });

  return entity;
}
