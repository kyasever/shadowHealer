// https://github.com/type-challenges/type-challenges

/* 
  用 extends 实现分支
  A extends B ? C : D
  A 集合是否为 B 集合的子集，如果是那么返回 C 否则返回 D。
*/
type Func1<T> = T /*值*/ extends string /*类型*/
  ? T /*值*/ extends 'foo' /*值*/
    ? 'is string foo'
    : T /*值*/ extends 'bar' /*值*/
    ? 'is string bar'
    : 'unexpected string value'
  : T /*值*/ extends number /*类型*/
  ? T /*值*/ extends 0 /*值*/
    ? 'is number 0'
    : T /*值*/ extends 1 /*值*/
    ? 'is number 1'
    : 'unexpected number value'
  : 'unexpected value type';

let fff: Func1<2>;

// 变量定义
type A = 'hello'; // 声明全局变量
type B = [A] extends infer T
  ? T // => 在这个表达式的作用域内，T 都为 [A]
  : never; // 声明局部变量

let bbb: B;

// 函数定义
type Func<A extends number, B extends string = 'hello'> = [A, B];
//     ↑ ↑           ↑    ↑           ↑        ↑        ↑
// 函数名 参数名    参数类型  参数名       参数类型  默认值      函数体
// 使用函数
type Test = Func<10, 'world'>; // => [10, 'world']

// 循环- 用递归代替循环
