# 角色生命周期

## makeEffect

如果是个远程技能,有弹道之类的,则可以用延迟 effect,让 effect 不要立即生效,
也可以将这个 effect 绑定到其他事件,让其他组件来 makeEffect

- caster.onEffect
- caster.buff.onEffect
- target.onBehit
- target.buff.onBehit
- makeEffect
  - effect 生效,效果进行结算,在此之后 effect 不应该再被修改了. 比如特效动画类的监听应该放在后面的钩子里
- target.afterBehit
- caster.afterEffect
- skada.addRecord

## calculateProperty

- 起点为 entity.property
- entity.onCal
- entity.buff.onCal
  - 终点为 entity 的各项属性, 属性只能计算,不能修改, 这里的增伤都是合并乘区的

## buff

- onEffect
- onBehit
- onCalculateProperty
- onAdd
- onRemove

## entity

- 装备, 装备是一个 buff, 装上就是 addBuff, 卸掉就是 removeBuff. 主要提供 property
- 遗物, 遗物也是一个 buff. 主要提供触发
- 角色天赋, 可以做成 buff, 也可以直接写在回调里面
  以上都是无限时间, 不可驱散, 单独显示的 buff
