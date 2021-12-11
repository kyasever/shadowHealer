# hs-js

开发两个版本

- node 命令行
- vue 版本

# 性能测试

指标:`run('stake -t 360000 -l 5')`
beta1.0 4783ms
bata1.1 8389ms
beta1.2 7221ms
`run('test')`
bata1.5 4547ms 因为 lightning 删了,所以快了点. 总体速度影响不大

beta1.5
[instance] 1439ms/3600s 在 vue 中阻塞运行. 效率只有上面不带 ui 的 1/30
[x32] fps215 在保证 vue 界面更新的前提下 215 帧. 也就是说如果这个低于 60 帧,就会很危险了

指标参考:
x32 60:红色告警, 120:黄色告警, 目前 215
instance 这个指标可能没有意义,如果模拟(跳过战斗/单测)的话肯定就不走 vue 了
console 1000 倍:黄色告警 目前 80,000

# tips:

- 重构是对的,如果编写了很多角色和道具后再迁移可就太难了. 另一方面,完全不进行兼容
- 复杂度如果可控的话,就不要着急写单测,最多写点全局性质的.避免改动连带改动单测成本过高
- 如果一件事情可以有多种写法可以实现的话, 那么不要把它当做优点,而是砍掉另一种方法,不然成本太高了

# release

beta1.0-11.24

- 可以模拟一场战斗, 支持 node 和 vue 运行.
- 重构了 commander 换成了自己实现的版本

beta1.1-11.29

- effect 重构, 万物皆 effect, 所有变更均走 makeEffect, 过程记录在 effect 日志中
- property 重构. 初始化走 calculateProperty().
- 简单的多次战斗模拟
- 优化了 debug 方式和 log 统计

beta1.2-12.3

- 正式引入 phaser 和 vue,重构项目目录

beta1.3-12.6

- 优化与调整序列, 定义生命周期
- 建立 vue 层级,规划后续分配
- 处理 asserts,打包也包含进去

beta1.4- 12.9

- 添加武僧,增加 json 文件获取, 增加从 json 创建角色
- 虽然增加 json 的读取 SOP,但是 json 编辑起来不太友好,考虑还是用 ts 来写伪 json 会合适一点...
- 去掉 nodejs 的兼容性支持, 接下来只支持 vue 版本. log 只兼容 vue

bata1.5- 12.11 架构重构

- 用 EventEmitter 重构所有事件... 将几个核心对象重构为 class
- 重构代码依赖结构 define -> battle -> entitys -> create -> vue
- 用 ts 定义代替手动定义的函数, 每个对象现在都有 on emit 两个函数
- 支持了 Entity.skill 从 data 创建的方式. buff 和反序列化暂缓
- effect buff 采用字符串,剩下的不着急,用到了再说.
- skill 增加了 canuse 回调,未保证灵活性,可以自行用 canuse 判断是否可用, 用 effect 处理使用的消耗. createwithdata 提供了基础的行为

bata1.6? ui 更新

- 首先得把 vant 换成 element, vant 这个不适合 pc, 手机用的...
- 技能 cd 改成基于实际时间。
- 控制器，ui 指示下一个技能用什么
- 血条组件. UI 做成血条背景。 文字显示。 有一个详情键
- skada 面板, 左右切换模式, 点击在 log 里显示详情
- stake 页面, 在 stake 页面中默认速度是满的, 可以自由的选择上哪些角色, 点开始后开始战斗
- test 页面, 构建一些 test, 点击后直出结果,并校验结果是否符合预期. 并附带性能测试

bata1.7? 游戏更新

- game 逻辑
- 可选角色与关卡
- 测试关卡与用例

beta1.8? phaser 更新
制作 phaser 界面, 尝试 phaser/vue 混合模式
下载一些 spine 的素材
加入角色动画和远程弹道
下周开发 phaser 版本

bata2.0 ? 游戏可玩,可分发.
可分发给一些玩家和开发者

# 界面逻辑

主体用 vue 分发
底层是 game canvas, 用 phaser 实现
上层是 vue 用 dom 实现
debug 功能做成一个单独的,可拖拽的 debug 面板 vue-draggable-resizable

短期来看, 可以用 vue 开发所有功能,保证游戏可玩, 任何 feature 都可以先开发 vue 版本,后考虑 phaser

# 核心逻辑

时间切片. 每秒 50 逻辑帧 0.02s 一帧, 在模拟中只有帧数
时间都是以帧数计算的, 每 update 走一帧, 50update 为游戏内逻辑 1s
AI 角色采用攻击间隔+技能优先级模式, 每 x 秒攻击一次,使用(平 a/技能/大招)
makeEffect 是绝对核心函数. 代表对某个角色施加一个影响, 只有这个函数有权利改变数据
支持协程和延时等功能

# 小目标 & 脑洞

走出舒适区:
每个角色要与玩家角色存在一点或多或少的交互. 不能是摆个按钮给玩家. 或者是之间的交互,与遗物的交互
玩家能够提供的能力, 盾(提高韧性,防打断) 霸体(免控) 控血
角色要有故事,应该编一些设定之类的东西
