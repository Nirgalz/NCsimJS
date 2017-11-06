class AIManager {

    constructor(pop, map, bui) {
        this.pop = pop;
        this.map = map;
        this.Buildings = bui;
     
    }

    checkData() {
        console.log(this.pop);
        console.log(this.map);
    }

    start(t) {
                

        let AIData = this;

        for (let l = 0; l <= AIData.pop.length - 1; l++) {
            let minion = AIData.pop[l];
            let mapTileRef = AIData.getMapTile(AIData.pop[l]);

            if (t !== undefined) {
                if (minion.wakeTick > t) {
                    //zZZZzzzzzZZZZZzzzzz

                } else if (minion.wakeTick === t) {
                    minion.wakeUp();
                } else if (minion.inventory.wood >= 10 && AIData.map.landscape[mapTileRef].localBuilding === ""){
                            this.Buildings.campFire(mapTileRef, l, t.tick)
                        }else
                //When minions has more than 90 hunger
                if (minion.hunger >= 90 && minion.isAlive === true) {

                    if (minion.inventory.food >= 10) {
                        minion.eat(10);
                        minion.inventory.food -= 10;
                    }
                    else if (AIData.map.landscape[mapTileRef].resources.wood > 10) {
                            AIData.map.landscape[mapTileRef].resources.wood -= 10;
                            minion.gather(10, "wood");
                        }
                         else if (AIData.map.landscape[mapTileRef].resources.food > 10) {
                            AIData.map.landscape[mapTileRef].resources.food -= 10;
                            minion.gather(10, "food");
                        }
                        
                        else {
                            minion.move();
                        }
                    }
                }
                //if minion is not too hungry and is alive
                else if (minion.hunger < 90 && minion.isAlive === true && minion.statusM !== "sleeping" && minion.statusM !== 'building') {
                    // if minion has lees than 100 food in inventory and the tile has more than x resources, will gather food
                    if (minion.inventory.food < 100 && AIData.map.landscape[mapTileRef].resources.food > 10) {
                        minion.inventory.food += 10;
                        AIData.map.landscape[mapTileRef].resources.food -= 10;
                        minion.move();

                        //if tile's foos is less than 100, minion plants food
                    } else if (AIData.map.landscape[mapTileRef].type === 'forest' || AIData.map.landscape[mapTileRef] === 'water') {
                        minion.move();
                    }
                    else if (AIData.map.landscape[mapTileRef].resources.food < 100) {

                        //minions plant, the more the are the faster
                        AIData.map.landscape[mapTileRef].resources.food += ( AIData.map.landscape[mapTileRef].localPop.length );
                    }
                    else if (AIData.map.landscape[mapTileRef].resources.food >= 100) {
                        AIData.map.landscape[mapTileRef].resources.food = 100;
                        minion.move();
                    }
                }
            }

        }

    

    getMapTile(minion) {
        for (let tile = 0; tile <= this.map.landscape.length; tile++) {

            if (minion.xCoordinate === this.map.landscape[tile].x && minion.yCoordinate === this.map.landscape[tile].y) {
                return tile;
            }
        }
    }
}