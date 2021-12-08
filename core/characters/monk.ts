import { SHLog } from '@core/log';
import { characterData } from '../data';
import { Battle, makeEffect, IBuff } from '../common';
import { createEntityFromData } from '.';

export function createEntityMonk(battle: Battle) {
  const monkData = characterData['monk'];
  const entity = createEntityFromData(battle, monkData);

  let cantAttack = 0;

  const skill5 = entity.skills['skill5'];

  entity.onEffect = () => {
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
  };

  skill5.onUse = () => {
    cantAttack = skill5.custom.during;
  };

  const skill6 = entity.skills['skill6'];

  const buff: IBuff = {
    name: skill6.name,
    target: entity,
    caster: entity,
    release: skill6.custom.duiring,
    onCalculateProperty: (property) => {
      property.apmax += 100;
    },
  };
  skill6.onUse = () => {
    makeEffect({
      name: skill6.name,
      target: entity,
      caster: entity,
      ap_caster: 50,
      heal: -entity.hpmax * 0.3,
      addBuff: buff,
    });
  };

  return entity;
}
