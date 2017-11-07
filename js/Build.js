class Build{
    
    constructor(map,pop)
    {
        this.map = map;
        this.pop = pop;
    }
    
    campFire(tile, minionIndex, startTick)
    {
        let cost = [100, 'wood'];
        let timeToBuild = 10;
        let minionsToBuild = 1;
        this.map.landscape[tile].localBuilding = "campFire";
        this.pop[minionIndex].statusM = "building";
        this.pop[minionIndex].wakeTick = startTick + 10;
        this.pop[minionIndex].inventory[cost[1]] -= cost[0];

    }
    
    potatoField(tile, minionIndex, startTick){
        let cost = [100, 'wood'];
        let timeToBuild = 10;
        let minionsToBuild = 1;
        this.map.landscape[tile].type = "potatoField";
        this.pop[minionIndex].statusM = "building";
        this.pop[minionIndex].wakeTick = startTick + 10;
        this.pop[minionIndex].inventory[cost[1]] -= cost[0];
    }
    
    
    
    fishingPole(minionIndex, startTick)
    {
        let cost = [100, 'wood'];
        let timeToBuild = 5;
        let minionsToBuild = 1;
        this.pop[minionIndex].statusM = "building a fishing pole";
        this.pop[minionIndex].wakeTick = startTick + 10;
        this.pop[minionIndex].inventory[cost[1]] -= cost[0];
        this.pop[minionIndex].inventory.fishingPole = 1;
    }
    
    shelter()
    {
        let cost = [300, 'wood'];
        let timeToBuild = 25;
        let minionsToBuild = 2;
        //todo: sleep recovery * 4
    }
    
    granary()
    {
        let cost = [500, 'wood'];
        let timeToBuild = 50;
        let minionsToBuild = 2;
        //todo: stocks 1000 food
    }
    
    woodPile()
    {
        let cost = [100, 'wood'];
        let timeToBuild = 50;
        let minionsToBuild = 2;
        //todo: stocks 1000 wood
    }
    
}