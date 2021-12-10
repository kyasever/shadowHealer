export const GameConfig = {
  /** 决定SHLog是否打印 */
  logLevel: 1,
  /** 游戏实际的帧间隔, 一倍速 */
  speed: 0.02,
};

/** 游戏理论的帧间隔, 即使实际瞬间就完成了, 理论永远是0.02循环一次 */
export const DeltaTime = 0.02;
/** 1/DealtaTime  */
export const FrameCount = 50;
