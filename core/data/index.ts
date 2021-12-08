import axios from 'axios';
export * from './characterData';

/** 从本地资源文件中读取一个json */
export async function loadFromJson<T>(name: string): Promise<T> {
  const res = await axios({
    method: 'get',
    url: `./assets/data/${name}`,
  }).catch((error) => {
    console.error('get data failed', error);
  });

  if (res) {
    return res['data'] as T;
  }
  return null;
}
