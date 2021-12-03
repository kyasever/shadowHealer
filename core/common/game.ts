import { Battle } from '.';

// 游戏, 决定下一步都做什么
export class Game {
  battle: Battle;
  initBattle() {
    this.battle = new Battle();
  }
}
