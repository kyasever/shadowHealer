import { Battle, createEntity, IEntity, makeEffect } from '../common';
import { randomRange } from '../common/utils';

export function createTeamDPS(
  battle: Battle,
  name: string,
  hp: number,
  attack: number
): IEntity {
  const character: IEntity = createEntity(battle, {
    hpmax: hp,
    apmax: 100,
    attack: attack,
    critRate: 0.2,
    critDamage: 2,
  });
  character.name = name;
  character.onAttack = () => {
    const damage = character.attack * randomRange(0.8, 1.2);
    makeEffect({
      caster: character,
      name: `normal`,
      target: battle.enemys[0],
      damage: {
        value: damage,
        critRate: character.critRate,
        critDamage: character.critDamage,
      },
    });
  };
  return character;
}
