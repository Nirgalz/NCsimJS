class AIManager{
    
    constructor(pop, map)
    {
        this.pop = pop;
        this.map = map;
    }
    
    checkData()
    {
        console.log(this.pop);
        console.log(this.map);
    }
    
    start()
    {
        let AIData = this;
        let inter = setInterval(function () 
        {
            for (let l = 0 ; l <= AIData.pop.length - 1; l++)
            {

                if (AIData.pop[l].hunger >= 90 && AIData.pop[l].isAlive === true) 
            {

                if(AIData.pop[l].inventory.food >= 10)
                {
                    AIData.pop[l].eat(10);
                    AIData.pop[l].inventory.food -=10;

                } 
                else
                {
                    let position = AIData.getMapTile(AIData.pop[l]);

                    if (AIData.map.landscape[position].resources.food > 10)
                    {
                        AIData.map.landscape[position].resources.food -=10;
                    AIData.pop[l].gather(10)

                    }
                    else
                    {
                        AIData.pop[l].move();
                    }
                    
                }
               
            }
            else if (AIData.pop[l].hunger < 90 && AIData.pop[l].isAlive === true)
            {
                
                let position = AIData.getMapTile(AIData.pop[l]);
                console.log(AIData.map.landscape[position].resources.food)

                    if (AIData.map.landscape[position].resources.food <100){
                                            
                        AIData.map.landscape[position].resources.food += 1;
                    }
                    else if (AIData.map.landscape[position].resources.food >=100){
                        AIData.map.landscape[position].resources.food = 100;
                        AIData.pop[l].move();
                    }
            }
            }
        
            
        }, 10)
    }
    
    getMapTile(minion)
    {
        for (let tile = 0 ; tile <= this.map.landscape.length ; tile++)
        {

            if (minion.xCoordinate === this.map.landscape[tile].x && minion.yCoordinate === this.map.landscape[tile].y)
            {
                return tile;
            }
        }
    }
        
}