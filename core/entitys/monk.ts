import {
  dealSkillWithPriority,
  Battle,
  Buff,
  createEntityFromData,
  makeEffect,
} from '../battle';
import { loadCharacterData } from '../data';
import { SHLog } from '../utils';

export function createEntityMonk(battle: Battle) {
  const monkData = loadCharacterData('monk');
  const entity = createEntityFromData(battle, monkData);
  entity.useComponent(dealSkillWithPriority);

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

  entity.buffCreater = {
    buff: () => {
      const buff: Buff = new Buff('buff');
      buff.release = skill6.custom.during;
      buff.on('calculateProperty', (property) => {
        property.apmax += 100;
      });
      return buff;
    },
  };

  skill6.on('use', () => {
    makeEffect({
      name: skill6.name,
      target: entity,
      caster: entity,
      ap_caster: 50,
      heal: -entity.hpmax * 0.3,
      addBuff: 'buff',
    });
  });

  return entity;
}
