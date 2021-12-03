# ui 设计

应该尽可能考虑简洁明晰, 因为是调试 UI 又不是界面 UI
能用 log 的还是用 log, 需要常住的内容, 定时通过指定获取数据, 然后更新到 UI 上吧.

先搞一个 runner 出来

用 vue! 也算突破舒适区了吧
vue 没有 antd 确实麻烦,不过也还好吧, 反正也不是那么重 UI 的项目

UI
setLevel 1 2 3 4 5
setGameSpeed slider 暂停 1 倍速 2 4 8 16 infinity

场上情况

绝对不能搞这么复杂!!!! 界面上常住的值,只要是需要显示的,就暴力轮询.
除非是那种发射一个火球的, 可以用监听, 因为本身也是 effect,而不是值. 值就是轮询!

<!-- 回调式和轮询式都搞吧..
在核心库里搞一个bindingValue类型, 可以在set的时候同步set vue的ref
bindRef(ref) 这样把vue的ref绑定到变量上.
除此之外的一律轮询 -->
