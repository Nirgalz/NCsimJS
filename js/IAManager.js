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
            let possibleActions = {
                survival: [],
                gathering: [],
                building: [], //planning ?
                comfort: [],
                exploration: []
            };

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


                    //
                    //EAT
                    if (minion.inventory.food >= 10 && minion.hunger > 90) {
                        possibleActions.survival.push(function () {
                            minion.eat(mapTileRef, 10, tick)
                        });
                    }
                    //survival sleep
                    if (minion.fatigue >= 100) {
                        possibleActions.survival.push(function () {
                            minion.sleep(mapTileRef, tick)
                        });
                    }

                    //GATHER
                    if (mapTile.resources.wood > 10 && minion.inventory.wood < 100) {
                        possibleActions.gathering.push(function () {
                            minion.gather(mapTileRef, 10, "wood", tick)
                        });
                    }

                    if (mapTile.resources.food > 10 && minion.inventory.food < 100) {
                        if (mapTile.type === "water"
                            && minion.inventory.fishingPole !== undefined) {
                            possibleActions.gathering.push(function () {
                                minion.gather(mapTileRef, 20, "food", tick)
                            });
                        }
                        else if (mapTile.type === "potatoField" && minion.inventory.food < 100) {
                            possibleActions.gathering.push(function () {
                                minion.gather(mapTileRef, 20, "food", tick)
                            });
                        }
                        else
                            if (mapTile.type === "grass" ||  mapTile.type === "forest") {
                            possibleActions.gathering.push(function () {
                                minion.gather(mapTileRef, 5, "food", tick)
                            });
                        }
                    }


                    //BUILDS
                    if (minion.inventory.wood >= 100
                        && mapTile.localBuilding === ""
                        && mapTile.type !== "forest"
                        && mapTile.type !== "water"
                        && mapTile.type !== "potatoField"
                        && mapTile.type !== "shelter") {
                        possibleActions.building.push(function () {
                            buildings.construction("campFire",mapTileRef, l, tick)
                        });
                        possibleActions.building.push(function () {
                            buildings.construction("potatoField",mapTileRef, l, tick)
                        });
                        possibleActions.building.push(function () {
                            buildings.construction("shelter",mapTileRef, l, tick)
                        });

                    }

                    if (minion.inventory.wood >= 50
                        && minion.inventory.fishingPole === undefined) {
                        possibleActions.building.push(function () {
                            buildings.construction("fishingPole",mapTileRef,l, tick)
                        });
                    }


                    //todo:plant function in minion class
                    //  if (mapTile.resources.food < 100 && mapTile.localBuilding === "") {
                    //
                    //     //minions plant, the more the are the faster
                    //      possibleActions.building.push(function () {
                    //          mapTile.resources.food += ( mapTile.localPop.length / 10);
                    //      });
                    // }


                    //sleeps comfort
                    if (minion.fatigue > 50) {
                        possibleActions.comfort.push(function () {
                            minion.sleep(mapTileRef, tick)
                        });
                    }


                    //randomly moves
                    possibleActions.exploration.push(function () {
                        minion.move("random", tick)
                    });


                    //randomy choses an action between those possible
                    function randomDumbness(actions) {
                        let randomAction = Math.floor((Math.random() * (actions.length )));
                        actions[randomAction]();
                    }

                    if (possibleActions.survival.length > 0) {
                        randomDumbness(possibleActions.survival)
                    }
                    else if (possibleActions.building.length > 0) {
                        randomDumbness(possibleActions.building)
                    }
                    else if (possibleActions.gathering.length > 0) {
                        randomDumbness(possibleActions.gathering)
                    }
                    else {
                        possibleActions.exploration[0]();
                    }
                    

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