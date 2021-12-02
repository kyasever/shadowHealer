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
