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


    startRandomPossibleActions(tick) {

        for (let l = 0; l <= this.pop.length - 1; l++) {
            let possibleActions = [];

            let minion = this.pop[l];
            let mapTileRef = this.getMapTile(this.pop[l]);
            let mapTile = this.map.landscape[mapTileRef];
            let buildings = this.Buildings;


            if (tick !== undefined) {

                //wakes up when action is done
                if (minion.wakeTick > tick) {
                    //zZZZzzzzzZZZZZzzzzz

                } else if (minion.wakeTick === tick) {
                    minion.wakeUp();
                }

                if (minion.isAlive === true) {

                    //EAT
                    if (minion.inventory.food >= 10) {
                        possibleActions.push(function () {
                            minion.eat(10, tick)
                        });
                    }

                    //GATHER
                    if (mapTile.resources.wood > 10) {
                        possibleActions.push(function () {
                            minion.gather(mapTileRef, 10, "wood", tick)
                        });
                    }


                    if (mapTile.resources.food > 10) {
                        possibleActions.push(function () {
                            minion.gather(mapTileRef, 10, "food", tick)
                        });
                    }


                    //BUILDS
                    if (minion.inventory.wood >= 10
                        && mapTile.localBuilding === ""
                        && mapTile.type !== "forest"
                        && mapTile.type !== 'water')
                    {
                        possibleActions.push(function () {
                            buildings.campFire(mapTileRef, l, tick)
                        });
                    }


                    //todo:plant function in minion class
                     if (mapTile.resources.food < 100) {

                        //minions plant, the more the are the faster
                         possibleActions.push(function () {
                             mapTile.resources.food += ( mapTile.localPop.length );
                         });
                    }
                    //  if (t.population[i].fatigue === 100 && t.population[i].statusM !== 'sleeping') {
                    //     t.population[i].sleep(t.tick);
                    // }




                    //randomly moves
                    possibleActions.push(function () {
                        minion.move()
                    });


                    //randomy choses an action between those possible
                    let randomAction = Math.floor((Math.random() * possibleActions.length));
                    possibleActions[randomAction]();
                }


            }

        }

    }


    start(tick) {


        let AIData = this;

        for (let l = 0; l <= AIData.pop.length - 1; l++) {
            let minion = AIData.pop[l];
            let mapTileRef = AIData.getMapTile(AIData.pop[l]);

            if (tick !== undefined) {
                if (minion.wakeTick > tick) {
                    //zZZZzzzzzZZZZZzzzzz

                } else if (minion.wakeTick === tick) {
                    minion.wakeUp();
                } else
                //When minions has more than 90 hunger
                if (minion.hunger >= 90
                    && minion.isAlive === true
                    && minion.statusM !== "sleeping"
                    && minion.statusM !== 'building') {

                    if (minion.inventory.food >= 10) {
                        minion.eat(10, tick);

                    }
                    else if (AIData.map.landscape[mapTileRef].resources.wood > 10) {
                        AIData.map.landscape[mapTileRef].resources.wood -= 10;
                        minion.gather(10, "wood", tick);
                    }
                    else if (AIData.map.landscape[mapTileRef].resources.food > 10) {
                        AIData.map.landscape[mapTileRef].resources.food -= 10;
                        minion.gather(10, "food", tick);
                    }

                    else {
                        minion.move();
                    }
                }
            }
            //if minion is not too hungry and is alive
            else if (minion.hunger < 90 && minion.isAlive === true && minion.statusM !== "sleeping" && minion.statusM !== 'building') {


                if (minion.inventory.wood >= 10 && AIData.map.landscape[mapTileRef].localBuilding === "") {
                    this.Buildings.campFire(mapTileRef, l, tick)
                }
                else
                // if minion has lees than 100 food in inventory and the tile has more than x resources, will gather food
                if (minion.inventory.food < 100 && AIData.map.landscape[mapTileRef].resources.food > 10) {
                    minion.gather(10, "food", tick);
                    AIData.map.landscape[mapTileRef].resources.food -= 10;
                    minion.move();

                }
                // else if (AIData.map.landscape[mapTileRef].type === 'forest' || AIData.map.landscape[mapTileRef] === 'water') {
                //     minion.move();
                // }
                else if (AIData.map.landscape[mapTileRef].resources.food < 100) {

                    //minions plant, the more the are the faster
                    AIData.map.landscape[mapTileRef].resources.food += ( AIData.map.landscape[mapTileRef].localPop.length );
                }
                else if (t.population[i].fatigue === 100 && t.population[i].statusM !== 'sleeping') {
                    t.population[i].sleep(t.tick);
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