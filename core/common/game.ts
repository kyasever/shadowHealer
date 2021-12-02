import { Battle } from '.';

export class Game {
  battle: Battle;
  initBattle() {
    this.battle = new Battle();
  }
}
