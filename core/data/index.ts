import { IEntityProperty, IEffect } from '../battle';
import { characterData } from './characterData';

export interface IDataEntity {
  name: string;
  property: IEntityProperty;
  // skill需要的字段会默认放进skill, 如果没有custom, 则使用时只有一个effect, 如果有,则自定义
  skills?: (Partial<IEffect> & {
    name: string;
    ap_caster?: number;
    cd?: number;
    cdRelease?: number;
    custom?: any;
    damageScale?: number;
  })[];
  skillPriority?: string[];
  [key: string]: any;
}

export function getCharacterData() {
  return characterData;
}
