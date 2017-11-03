class AIManager {

    constructor(pop, map, speed) {
        this.pop = pop;
        this.map = map;
        this.tickRate = speed;
    }

    checkData() {
        console.log(this.pop);
        console.log(this.map);
    }

    start() {
        let AIData = this;
        let inter = setInterval(function () {
            for (let l = 0; l <= AIData.pop.length - 1; l++) {
                let minion = AIData.pop[l];
                let mapTileRef = AIData.getMapTile(AIData.pop[l]);

                //When minions has more than 90 hunger
                if (minion.hunger >= 90 && minion.isAlive === true) {

                    if (minion.inventory.food >= 10) {
                        minion.eat(10);
                        minion.inventory.food -= 10;
                    }
                    else {
                        if (AIData.map.landscape[mapTileRef].resources.food > 10) {
                            AIData.map.landscape[mapTileRef].resources.food -= 10;
                            minion.gather(10);
                        }
                        else {
                            minion.move();
                        }
                    }
                }
                //if minion is not too hungry and is alive
                else if (minion.hunger < 90 && minion.isAlive === true) {
                    // if minion has lees than 100 food in inventory and the tile has more than x resources, will gather food
                    if (minion.inventory.food < 100 && AIData.map.landscape[mapTileRef].resources.food >10){
                        minion.inventory.food += 10;
                        AIData.map.landscape[mapTileRef].resources.food -= 10;
                        minion.move();

                        //if tile's foos is less than 100, minion plants food
                    } else if(AIData.map.landscape[mapTileRef].type === 'forest' || AIData.map.landscape[mapTileRef]=== 'water'){
                        minion.move();
                    }
                    else if (AIData.map.landscape[mapTileRef].resources.food < 100) {
            
                        AIData.map.landscape[mapTileRef].resources.food += (5 * AIData.map.landscape[mapTileRef].localPop.length);
                    }
                    else if (AIData.map.landscape[mapTileRef].resources.food >= 100) {
                        AIData.map.landscape[mapTileRef].resources.food = 100;
                        minion.move();
                    }
                }
            }
        }, AIData.tickRate)
    }

    getMapTile(minion) {
        for (let tile = 0; tile <= this.map.landscape.length; tile++) {

            if (minion.xCoordinate === this.map.landscape[tile].x && minion.yCoordinate === this.map.landscape[tile].y) {
                return tile;
            }
        }
    }
}