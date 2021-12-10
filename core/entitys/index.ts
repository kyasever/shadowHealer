import { Battle, Entity } from '@core/battle';
import { IDataEntity } from '@core/data';
import { SHLog } from '@core/utils';
import { createEntityMonk } from './monk';
import { createEntityWizzard } from './wizzard';
import { createEnemyBoss, createEnemyStake } from './enemy';
import { createDead, createTeamDPS } from './teams';

const name_entityCreator = {
  monk: createEntityMonk,
  wizzard: createEntityWizzard,
  stake: createEnemyStake,
  normalBOSS: createEnemyBoss,
  dead: createDead,
  normalDPS: createTeamDPS,
};

/*
 * 统一入口
 * 对于外部来说, 只需要一个字符串就应该能拿到自己想要的entity实例, 不应该那么多废话
 * 最多再加一波动态生成函数
 */
export function createEntity(
  key: string,
  battle: Battle,
  data?: IDataEntity
): Entity {
  if (name_entityCreator[key]) {
    return name_entityCreator[key](battle, data);
  } else {
    SHLog.error(`无此 entity: ${key} failed`, arguments);
  }
}
