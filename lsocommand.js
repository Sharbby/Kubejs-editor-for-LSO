let lso_cache = {
    BlockTemp:{},
    FuelItem:{},
    ItemTemp:{},
    ConsTemp:{},
    HealCons:{},
    ThirCons:{}
}

ServerEvents.commandRegistry(event => {
    const { commands , arguments : args} = event;
    event.register(
        commands.literal('lso_export')
        .requires(sre => sre.hasPermission(2))
        .executes(ctx => {
            const player = ctx.source.player
            player.tell('导出BlockTemperatures.json……')
            JsonIO.write('kubejs/export/blockTemperatures.json',JSON.stringify(lso_cache.BlockTemp, null, 2))
            player.tell('导出fuelItem.json……')
            JsonIO.write('kubejs/export/fuelItem.json',JSON.stringify(lso_cache.FuelItem, null, 2))
            player.tell('导出itemTemperatures.json……')
            JsonIO.write('kubejs/export/itemTemperatures.json',JSON.stringify(lso_cache.ItemTemp, null, 2))
            player.tell('导出healingConsumables.json……')
            JsonIO.write('kubejs/export/healingConsumables.json',JSON.stringify(lso_cache.HealCons, null, 2))
            player.tell('导出thirstConsumables.json……')
            JsonIO.write('kubejs/export/thirstConsumables.json',JSON.stringify(lso_cache.ThirCons, null, 2))
            player.tell('导出temperatureConsumables.json……')
            JsonIO.write('kubejs/export/temperatureConsumables.json',JSON.stringify(lso_cache.ConsTemp, null, 2))
            return 0
        })
    )
    event.register(
        commands.literal('lso_add')
        .requires(sre => sre.hasPermission(2))
        .then(commands.literal('BlockTemp')
            .then(commands.argument('Temp',args.FLOAT.create(event))
                .executes(ctx =>{
                    const Temp = args.FLOAT.getResult(ctx, "Temp")
                    const player = ctx.source.player
                    player.inventory.allItems.forEach(itemStack =>{
                        lso_cache.BlockTemp[itemStack.id.toString()] = [
                            {
                                "properties":{},
                                "temperature":Temp
                            }
                        ]
                        player.tell(itemStack.id.toString() + '已添加到缓存,温度' + Temp)
                    })
                    return 0
                })
            )
            .then(commands.literal('AddWithCount')
                .then(commands.argument('MulNumbers',args.FLOAT.create(event))
                    .executes(ctx =>{
                        const player = ctx.source.player
                        const MulNumbers = args.FLOAT.getResult(ctx, "MulNumbers")
                        player.inventory.allItems.forEach(itemStack =>{
                            lso_cache.BlockTemp[itemStack.id.toString()] = [
                                {
                                    "properties":{},
                                    "temperature":Number(itemStack.count * MulNumbers)
                                }
                            ]
                            player.tell(itemStack.id.toString() + '已添加到缓存,温度' + Number(itemStack.count * MulNumbers))
                        })
                        return 0
                    })
                )
            )
        )
        .then(commands.literal('ItemTemp')
            .then(commands.argument('Temp',args.FLOAT.create(event))
                .executes(ctx =>{
                    const player = ctx.source.player
                    const Temp = args.FLOAT.getResult(ctx, "Temp")
                    player.inventory.allItems.forEach(itemStack =>{
                        lso_cache.ItemTemp[itemStack.id.toString()] = {
                            "temperature":Number(Temp)
                        }
                        player.tell(itemStack.id.toString() + '已添加到缓存，温度' + Number(Temp))
                    })
                    return 0
                })
            )
            .then(commands.literal('AddWithCount')
                .then(commands.argument('MulNumbers',args.FLOAT.create(event))
                    .executes(ctx =>{
                        const player = ctx.source.player
                        const Temp = args.FLOAT.getResult(ctx, "MulNumbers")
                        player.inventory.allItems.forEach(itemStack =>{
                            lso_cache.ItemTemp[itemStack.id.toString()] = {
                                "temperature":Number(Temp*itemStack.count)
                            }
                            player.tell(itemStack.id.toString() + '已添加到缓存，温度' + Number(Temp*itemStack.count))
                        })
                        return 0
                    })
                )
            )
        )
        .then(commands.literal('FuelItem')
            .then(commands.argument('FuelValue',args.INTEGER.create(event))
                .executes(ctx =>{
                    const Value = args.INTEGER.getResult(ctx, "FuelValue")//看看
                    const player = ctx.source.player
                    let mode
                    let Value2
                    if (Value >= 0) {
                        mode = 'HEATING'
                        Value2 = Number(Value)
                    }
                    else {
                        mode = 'COOLING'
                        Value2 = Number(-Value)
                    }
                    player.inventory.allItems.forEach(itemStack =>{
                        lso_cache.FuelItem[itemStack.id.toString()] = 
                            {
                                "thermalType":mode.toString(),
                                "fuelValue":Value2
                            }
                        player.tell(itemStack.id.toString() + '已添加到缓存,燃烧时间' + Value2 + '，模式' + mode.toString())
                    })
                    return 0
                })
            )
            .then(commands.literal('AddWithCount')
                .then(commands.argument('MulNumbers',args.FLOAT.create(event))
                    .executes(ctx =>{
                        const Value = args.FLOAT.getResult(ctx, "MulNumbers")//看看
                        const player = ctx.source.player
                        let mode
                        let Value2
                        if (Value >= 0) {
                            mode = 'HEATING'
                            Value2 = Number(Value)
                        }
                        else {
                            mode = 'COOLING'
                            Value2 = Number(-Value)
                        }
                        player.inventory.allItems.forEach(itemStack =>{
                            lso_cache.FuelItem[itemStack.id.toString()] = 
                                {
                                    "thermalType":mode.toString(),
                                    "fuelValue":Number(Value2*itemStack.count)
                                }
                            player.tell(itemStack.id.toString() + '已添加到缓存,燃烧时间' + Number(Value2*itemStack.count) + '，模式' + mode.toString())
                        })
                        return 0
                    })
                )
            )
        )
        .then(commands.literal('HealCons')
            .then(commands.argument('HealingValue',args.FLOAT.create(event))
                .then(commands.argument('HealingTime',args.INTEGER.create(event))
                    .executes(ctx =>{
                        const Hvalue = args.FLOAT.getResult(ctx, "HealingValue")
                        const Htime = args.INTEGER.getResult(ctx, "HealingTime")
                        const player = ctx.source.player
                        player.inventory.allItems.forEach(itemStack=>{
                            lso_cache.HealCons[itemStack.id.toString()] = {
                                "healingCharges": 1,
                                "healingValue": Number(Hvalue),
                                "healingTime": Number(Htime)
                            }
                            player.tell(itemStack.id.toString() + '已添加到缓存,治疗量' + Hvalue + '，治疗时间' + Htime)
                        })
                        return 0
                    })
                )
            )
        )
        .then(commands.literal('ConsTemp')
            .then(commands.literal('AddWithCount')
                .then(commands.argument('FoodLevel',args.INTEGER.create(event))
                    .then(commands.argument('DrinkLevel',args.INTEGER.create(event))
                        .then(commands.argument('FoodMulNumber',args.FLOAT.create(event))
                            .then(commands.argument('DrinkMulNumber',args.FLOAT.create(event))
                                .executes(ctx => {
                                    const FoodLevel = args.INTEGER.getResult(ctx,"FoodLevel")
                                    const DrinkLevel = args.INTEGER.getResult(ctx,"DrinkLevel")
                                    const FoodMulNumber = args.FLOAT.getResult(ctx,"FoodMulNumber")
                                    const DrinkMulNumber = args.FLOAT.getResult(ctx,"DrinkMulNumber")
                                    const player = ctx.source.player
                                    player.inventory.allItems.forEach(itemStack => {
                                        lso_cache.ConsTemp[itemStack.id.toString()] = []
                                        if (FoodLevel != 0) lso_cache.ConsTemp[itemStack.id.toString()].push({
                                            "group": "FOOD",
                                            "temperatureLevel": Number(FoodLevel),
                                            "duration": Number(FoodMulNumber*itemStack.count)
                                        })
                                        if (DrinkLevel != 0) lso_cache.ConsTemp[itemStack.id.toString()].push({
                                            "group": "DRINK",
                                            "temperatureLevel": Number(DrinkLevel),
                                            "duration": Number(DrinkMulNumber*itemStack.count)
                                        })
                                        player.tell(itemStack.id.toString() + '已添加到缓存,饮食等级' + FoodLevel + '时间' + Number(FoodMulNumber*itemStack.count) + '饮料等级' + DrinkLevel + '时间' + Number(DrinkMulNumber*itemStack.count))
                                    })
                                    return 0
                                })
                            )
                        )
                    )
                )
            )
            .then(commands.argument('FoodLevel',args.INTEGER.create(event))
                .then(commands.argument('DrinkLevel',args.INTEGER.create(event))
                    .then(commands.argument('FoodDuration',args.INTEGER.create(event))
                        .then(commands.argument('DrinkDuration',args.INTEGER.create(event))
                            .executes(ctx => {
                                const FoodLevel = args.INTEGER.getResult(ctx,"FoodLevel")
                                const DrinkLevel = args.INTEGER.getResult(ctx,"DrinkLevel")
                                const FoodDuration = args.INTEGER.getResult(ctx,"FoodDuration")
                                const DrinkDuration = args.INTEGER.getResult(ctx,"DrinkDuration")
                                const player = ctx.source.player
                                player.inventory.allItems.forEach(itemStack => {
                                    lso_cache.ConsTemp[itemStack.id.toString()] = []
                                    if (FoodLevel != 0) lso_cache.ConsTemp[itemStack.id.toString()].push({
                                        "group": "FOOD",
                                        "temperatureLevel": Number(FoodLevel),
                                        "duration": Number(FoodDuration)
                                    })
                                    if (DrinkLevel != 0) lso_cache.ConsTemp[itemStack.id.toString()].push({
                                        "group": "DRINK",
                                        "temperatureLevel": Number(DrinkLevel),
                                        "duration": Number(DrinkDuration)
                                    })
                                })
                            })
                        )
                    )
                )
            )
        )
        .then(commands.literal('ThirCons')
            .then(commands.argument('Hydration',args.FLOAT.create(event))
                .then(commands.argument('Saturation',args.FLOAT.create(event))
                    .executes(ctx =>{
                        const Hvalue = args.FLOAT.getResult(ctx, "Hydration")
                        const Htime = args.FLOAT.getResult(ctx, "Saturation")
                        const player = ctx.source.player
                        player.inventory.allItems.forEach(itemStack=>{
                            lso_cache.ThirCons[itemStack.id.toString()] = [{
                                "hydration": Number(Hvalue),     //饮水值，和饥饿值一样，一个水滴图标代表2，这里的4也就是两个水滴的饮水值
                                "saturation": Number(Htime),    //水合度（对应饥饿值的饱食度），数量同上计算
                                "effects": [],
                                "nbt": {}
                            }]
                            player.tell(itemStack.id.toString() + '已添加到缓存,水量' + Hvalue + '，饱水' + Htime)
                        })
                        return 0 
                    })
                )
            )
        )
    )
})