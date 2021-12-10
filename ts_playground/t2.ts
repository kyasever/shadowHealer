interface Fish {
  fish: string;
}
interface Water {
  water: string;
}
interface Bird {
  bird: string;
}
interface Sky {
  sky: string;
}
//naked type
type Condition<T> = T extends Fish ? Water : Sky;

let condition1: Condition<Fish | Bird> = { water: '水' };
let condition2: Condition<Fish | Bird> = { sky: '天空' };
