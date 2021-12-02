# ui设计

应该尽可能考虑简洁明晰, 因为是调试UI又不是界面UI
能用log的还是用log, 需要常住的内容, 定时通过指定获取数据, 然后更新到UI上吧.

先搞一个runner出来

用vue! 也算突破舒适区了吧
vue没有antd确实麻烦,不过也还好吧, 反正也不是那么重UI的项目

UI
setLevel 1 2 3 4 5
setGameSpeed slider 暂停 1倍速 2 4 8 16 infinity

场上情况

绝对不能搞这么复杂!!!! 界面上常住的值,只要是需要显示的,就暴力轮询.
除非是那种发射一个火球的, 可以用监听, 因为本身也是effect,而不是值. 值就是轮询!

<!-- 回调式和轮询式都搞吧..
在核心库里搞一个bindingValue类型, 可以在set的时候同步set vue的ref
bindRef(ref) 这样把vue的ref绑定到变量上.
除此之外的一律轮询 -->



