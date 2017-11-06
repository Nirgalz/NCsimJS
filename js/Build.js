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
        this.map.landscape[tile].foodModifier * 0;
        this.map.landscape[tile].localBuilding = "campFire";
        this.pop[minionIndex].statusM = "building";
        this.pop[minionIndex].wakeTick = startTick + 10;
        this.pop[minionIndex].inventory.wood -= 10;

    }
    
    tool()
    {
        let cost = [100, 'wood'];
        let timeToBuild = 5;
        let minionsToBuild = 1;
        //todo: allows to plant dirt - plant on grass * 2
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