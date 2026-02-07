###这是一个用于LSO数据包编辑的kubejs脚本

##使用方法：
1.安装kubejs

2.将js文件放入\.minecraft\kubejs\server_scripts

##命令详解：

#lso_add
将所有背包物品加入缓存，使用lso_export一次性导出
- BlockTemp->blockTemperatures.json
  - 直接后跟温度
  - AddWithCount后面加常数，温度=常数 x 物品数量
- ItemTemp->itemTemperatures.json
  - 直接后跟温度
  - AddWithCount后面加常数，温度=常数 x 物品数量
- FuelItem->fuelItem.json
  - 直接后跟温度
  - AddWithCount后面加常数，温度=常数 x 物品数量
  - 正数会写为Heating，负数Cooling
- HealCons->healingConsumables.json
  - 直接后跟HealingValue与HealingTime
- ConsTemp->temperatureConsumables.json
  - 直接后跟温度FoodLevel,DrinkLevel,FoodDuration,DrinkDuration
  - AddWithCount后面加FoodLevel,DrinkLevel,FoodMulNumber,DrinkMulNumber，此时FoodDuration=FoodMulNumber x 数量,DrinkDuration=DrinkMulNumber x 数量
- ThirCons->thirstConsumables.json
  - 直接后跟Hydration，Saturation

#lso_export
导出所有文件到\.minecraft\kubejs\export
