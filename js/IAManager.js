class AIManager {

    constructor(pop, map, bui, team) {
        this.pop = pop;
        this.map = map;
        this.Buildings = bui;
        this.Team = team;

    }

    checkData() {
        console.log(this.pop);
        console.log(this.map);
    }


    startRandomPossibleActions(tick) {

        let teams = [];
        for (let l = 0; l < this.pop.length; l++) {
            let possibleActions = {
                team: false,
                survival: [],
                gathering: [],
                building: [], //planning ?
                comfort: [],
                exploration: [],
                social: []
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

                    let possibleDestinations = [];

                    //
                    //EAT
                    if (minion.inventory.food >= 10 && minion.hunger > 90) {

                        //if there is a known destination, will set it as the minion's destination
                        if (minion.IY.NEEDS.campFire === false) {
                            // will get all possible destinations and get to the closest
                            possibleDestinations = minion.getTilesFromType('campFire');
                            minion.setDestination(possibleDestinations, possibleActions, 'eat');
                        }
                        else {
                            possibleActions.survival.push(function () {
                                minion.eat(mapTileRef, tick)
                            });
                        }
                    }
                    //sleep
                    //gets to the nearest shelter, else sleeps in its tile
                    if (minion.fatigue >= 100) {

                        //if there is a known destination, will set it as the minion's destination
                        if (minion.IY.NEEDS.shelter === false) {
                            possibleDestinations = minion.getTilesFromType('shelter');
                            minion.setDestination(possibleDestinations, possibleActions, 'sleep');
                        }
                        else {
                            possibleActions.survival.push(function () {
                                minion.sleep(mapTileRef, tick)
                            });
                        }
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
                        else if (mapTile.type === "grass" || mapTile.type === "forest") {
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
                        && mapTile.type !== "shelter"
                        && mapTile.type !== "campFire") {
                        //if the minion knows a campFire or a shelter, it will not build a second one
                        if (!minion.getTilesFromType('campFire', minion)) {
                            possibleActions.building.push(function () {
                                buildings.construction("campFire", mapTileRef, l, tick)
                            });
                        }
                        // if (!minion.getTilesFromType('shelter', minion)){
                        //     possibleActions.building.push(function () {
                        //         buildings.construction("shelter", mapTileRef, l, tick)
                        //     });
                        // }
                        // but it will build potatofields when it can
                        possibleActions.building.push(function () {
                            buildings.construction("potatoField", mapTileRef, l, tick)
                        });
                    }

                    if (minion.inventory.wood >= 50
                        && minion.inventory.fishingPole === undefined) {
                        possibleActions.building.push(function () {
                            buildings.construction("fishingPole", mapTileRef, l, tick)
                        });
                    }


                    //social actions
                    if (mapTile.localPop.length > 2) {

                        let minions = [];
                        for (let j = 0; j < mapTile.localPop.length; j++) {
                            if (mapTile.localPop[j].id !== minion.id) {
                                if (minion.IY.socialCircle[mapTile.localPop[j].id]) {
                                    if ((tick - minion.IY.socialCircle[mapTile.localPop[j].id].lastMet) > 100) {
                                        minions.push(mapTile.localPop[j]);
                                    }
                                } else minions.push(mapTile.localPop[j]);

                            }
                            minions.push(minion);
                        }
                        if (minions.length > 1) {

                            for (let j = 0 ; j <minions.length ; j++) {
                                if (minion.IY.CANS.wood === true
                                    && minion.IY.NEEDS.shelter === true
                                    && minions[j].IY.CANS.wood === true
                                    && minions[j].IY.NEEDS.shelter === true
                                    && minions[j].IY.objective.destination.isTrue === false) {
                                    let teamId = parseInt("" + minion.xCoordinate + "" + minion.yCoordinate);
                                    if (teams[teamId] === undefined) {
                                        teams[teamId] = [];
                                    }
                                    // console.log(teamId);
                                    // console.log(minion.xCoordinate);
                                    // console.log(minion.yCoordinate);
                                    teams[teamId].push(minion);
                                    minion.IY.objective.action = 'shelter';
                                    possibleActions.team = true;


                                    // possibleActions.building.push(function () {
                                    //             buildings.construction("shelter", mapTileRef, l, tick)
                                    //          });

                                }
                            }
                            // possibleActions.social.push(function () {
                            //     minion.speak(minions)
                            // })
                        }
                    }


                    //randomly moves
                    possibleActions.exploration.push(function () {
                        minion.move("random", tick)
                    });


                    //randomy choses an action between those possible
                    function randomDumbness(actions) {
                        let randomAction = Math.floor((Math.random() * (actions.length)));
                        actions[randomAction]();
                    }

                    if (possibleActions.team === true) {

                    }
                    else if (possibleActions.social.length > 0) {
                        randomDumbness(possibleActions.social)
                    }
                    else
                        if (minion.IY.objective.destination.isTrue === true) {
                        minion.move('objective', tick);
                    }
                    else if (minion.IY.objective.action == 'shelter') {
                        buildings.construction("shelter", mapTileRef, l, tick);
                        minion.IY.objective.action = 'random';
                    }
                    else if (minion.IY.objective.action == 'sleep') {
                        minion.sleep(mapTileRef, tick);
                        minion.IY.objective.action = 'random';
                    }
                    else if (minion.IY.objective.action == 'eat') {
                        minion.eat(mapTileRef, tick);
                        minion.IY.objective.action = 'random';
                    }
                    else if (possibleActions.survival.length > 0) {
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

        if (teams && teams.length) {
            for (let i = 0; i < teams.length; i++) {
                if (teams[i] !== undefined) {
                    this.Team.setClosestPossibleDestination(teams[i]);
                }
            }
        }


    }

    // get the actual tile of a minion
    getMapTile(minion) {
        for (let tile = 0; tile < this.map.landscape.length; tile++) {

            if (minion.xCoordinate === this.map.landscape[tile].x && minion.yCoordinate === this.map.landscape[tile].y) {

                return tile;
            }
        }
    }


}