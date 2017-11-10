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

                }
                else if (minion.wakeTick === tick) {
                    minion.backToWork();
                }
                else if (minion.isAlive === true) {

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

                    if (mapTile.resources.food > 10){
                        if (mapTile.type === "water" 
                        && minion.inventory.fishingPole != undefined )
                        {
                            possibleActions.push(function () {
                                minion.gather(mapTileRef, 20, "food", tick)
                        });
                    }
                    else if (mapTile.type === "potatoField") {
                        possibleActions.push(function () {
                                minion.gather(mapTileRef, 20, "food", tick)
                    });
                    }else if (mapTile.type === "grass" || mapTile.type === "dirt" || mapTile.type === "forest") {
                        possibleActions.push(function () {
                            minion.gather(mapTileRef, 5, "food", tick)
                        });
                    }
                    }
                    


                    //BUILDS
                    if (minion.inventory.wood >= 100
                        && mapTile.localBuilding === ""
                        && mapTile.type !== "forest"
                        && mapTile.type !== 'water')
                    {
                        possibleActions.push(function () {
                            buildings.campFire(mapTileRef, l, tick)
                        });
                        possibleActions.push(function () {
                            buildings.potatoField(mapTileRef, l, tick)
                        });
                       
                    }
                    
                    if (minion.inventory.wood >= 100 
                    && minion.inventory.fishingPole === undefined ){
                         possibleActions.push(function () {
                            buildings.fishingPole(l, tick)
                        });
                    }


                    //todo:plant function in minion class
                     if (mapTile.resources.food < 100 && mapTile.localBuilding === "") {

                        //minions plant, the more the are the faster
                         possibleActions.push(function () {
                             mapTile.resources.food += ( mapTile.localPop.length / 10);
                         });
                    }
              


                    //sleeps
                    if (minion.fatigue >= 100){
                        possibleActions.push(function () {
                            minion.sleep(tick)
                        });
                    }



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



    getMapTile(minion) {
        for (let tile = 0; tile <= this.map.landscape.length; tile++) {
            
            if (minion.xCoordinate === this.map.landscape[tile].x && minion.yCoordinate === this.map.landscape[tile].y) {
                //console.log(tile);
                //console.log(minion);
                return tile;
            }
        }
    }
}