class Minion {

    constructor(id, x, y, map, birthTick, buildings, mapTileRef) {
        this.id = id;
        this.isAlive = true;
        this.birthday = birthTick;
        this.statusM = 'idle';
        this.xCoordinate = x;
        this.yCoordinate = y;
        this.mapTileRef = mapTileRef;
        this.mapTile = map.landscape[mapTileRef];
        this.buildings = buildings;
        this.health = 100;
        this.hunger = 0;
        this.fatigue = 0;
        this.inventory = {wood: 0, food: 20};
        this.map = map;
        this.tick = 0;
        this.wakeTick = null;
        //IY is the 'dialogue interface' of minions as well as their 'consciousness' of their environment
        this.IY = {
            map: [],
            socialCircle: [],
            NEEDS: {
                shelter: true,
                campFire: true
            },
            CANS: {},
            objective: {
                destination: {isTrue: false, x: null, y: null},
                action: 'random'
            },
            possibleActions: {
                survival: [],
                gathering: [],
                building: [], //planning ?
                comfort: [],
                exploration: [],
                social: []
            }
        };
        this.updateIY();

        //first tile a minion is aware of
        for (let tile = 0; tile < map.landscape.length; tile++) {
            if (map.landscape[tile].x === x && map.landscape[tile].y === y) {
                this.IY.map[tile] = map.landscape[tile];
            }
        }
    }


    updateIY() {
        //NEEDS
        //food
        this.IY.NEEDS.food = (this.inventory.food < 10 && this.hunger > 90);
        //campfire
        if (this.IY.NEEDS.campFire === true) {
            if (this.getTilesFromType('campFire')) {
                this.IY.NEEDS.campFire = false;
            }
        }

        //sleep
        this.IY.NEEDS.sleep = (this.fatigue === 100);
        //shelter
        if (this.IY.NEEDS.shelter === true) {
            if (this.getTilesFromType('shelter')) {
                this.IY.NEEDS.shelter = false;
            }
        }

        //CANS
        //food
        this.IY.CANS.food = (this.inventory.food > 50);

        //wood
        this.IY.CANS.wood = (this.inventory.wood === 100);
    }

    speak(minions) {
        let IYC = this.filtrateIY(this.IY.CANS);
        let IYN = this.filtrateIY(this.IY.NEEDS);
        let speech = "I" + this.id + "~N:";

        for (let j = 0; j < IYN.length; j++) {
            speech += IYN[j] + " ";
        }
        speech += "~C:";
        for (let k = 0; k < IYC.length; k++) {
            speech += IYC[k] + " ";
        }
        speech += "~Y";

        //list of already met minions
        for (let l = 0; l < minions.length; l++) {


            if (this.IY.socialCircle[minions[l].id] === undefined) {
                this.IY.socialCircle[minions[l].id] = {
                    id: minions[l].id,
                    lastMet: this.tick,
                    NEEDS: minions[l].IY.NEEDS,
                    CANS: minions[l].IY.CANS,
                    trust: 0
                };
            }
            else {
                this.IY.socialCircle[minions[l].id].trust++;
                this.IY.socialCircle[minions[l].id].lastMet = this.tick;
                this.IY.socialCircle[minions[l].id].NEEDS = minions[l].IY.NEEDS;
                this.IY.socialCircle[minions[l].id].CANS = minions[l].IY.CANS;
            }


        }
        this.statusM = 'speak';
        this.wakeTick = this.tick + 10;

    }

    filtrateIY(IY) {
        let result = [];
        let keys = Object.keys(IY);
        for (let i = 0; i < keys.length; i++) {
            if (IY[keys[i]] === true) {
                result.push(keys[i]);
            }
        }
        return result;
    }

    getAge(presentTick) {
        return presentTick - this.birthday;
    }

    //starving mechanism
    starve() {
        let minion = this;

        if (minion.health <= 0) {
            minion.statusM = 'dead';
            minion.isAlive = false;
        }
        else if (minion.isAlive === true) {
            minion.hunger += 1;
            if (minion.hunger > 100) minion.hunger = 100;
            if (minion.hunger >= 100) minion.health -= 0.1;
        }

    }

    eat(mapTileRef, tick) {
        let modifier = this.map.landscape[mapTileRef].modifiers.eat;
        this.inventory.food -= 10;
        this.hunger -= 20 * modifier;
        this.health = 100;
        if (this.health > 100) this.health = 100;
        this.statusM = 'eating';
        this.wakeTick = tick + 10;

    }

    gather(mapTileRef, quantity, type, tick) {
        this.inventory[type] += quantity;
        this.map.landscape[mapTileRef].resources[type] -= 10;

        this.statusM = 'gather' + type;
        this.wakeTick = tick + 10;

    }

    //manages minions movements :
    //if destination is set to 'random', will move randomly
    //else it will look at IY.objective of the minion and move one tile to the objective
    move(destination, tick) {

        //removes minion from tile
        for (let i = 0; i < this.map.landscape.length; i++) {
            if (this.xCoordinate === this.map.landscape[i].x && this.yCoordinate === this.map.landscape[i].y) {
                for (let j = 0; j < this.map.landscape[i].localPop.length; j++) {
                    if (this.map.landscape[i].localPop[j].id === this.id) {
                        this.map.landscape[i].localPop.splice(j, 1);
                    }
                }
            }
        }

        //random direction : exploration
        let randomPossibleDirection = function (it) {
            let randomNum = it.randomIntInRange(4);
            switch (randomNum) {
                case 1:
                    if (it.xCoordinate + 1 < it.map.x) {
                        it.xCoordinate++;
                    } else {
                        randomPossibleDirection(it);
                    }
                    break;
                case 2:
                    if (it.xCoordinate - 1 >= 0) {
                        it.xCoordinate--;
                    } else {
                        randomPossibleDirection(it);
                    }
                    break;
                case 3:
                    if (it.yCoordinate + 1 < it.map.y) {
                        it.yCoordinate++;
                    } else {
                        randomPossibleDirection(it);
                    }
                    break;
                case 4:
                    if (it.yCoordinate - 1 >= 0) {
                        it.yCoordinate--;
                    } else {
                        randomPossibleDirection(it);
                    }
                    break;
            }
        };

        //basic pathfinder
        let getToDestination = function (it) {
            let distance = {
                xDist: it.IY.objective.destination.x - it.xCoordinate,
                yDist: it.IY.objective.destination.y - it.yCoordinate
            };
            it.xCoordinate += Math.sign(distance.xDist);
            it.yCoordinate += Math.sign(distance.yDist);
            it.wakeTick = tick + 5;
            if (it.xCoordinate === it.IY.objective.destination.x && it.yCoordinate === it.IY.objective.destination.y) {
                it.IY.objective.destination.isTrue = false;
            }

        };


        if (destination === "random") {
            randomPossibleDirection(this);
        }
        else {
            getToDestination(this);
        }

        //add minion to tile
        for (let i = 0; i < this.map.landscape.length; i++) {
            if (this.xCoordinate === this.map.landscape[i].x && this.yCoordinate === this.map.landscape[i].y) {
                this.map.landscape[i].localPop.push(this);
                //adds new tile to personal map
                this.IY.map[i] = this.map.landscape[i];
                //updates maptile & maptileref
                this.mapTile = this.map.landscape[i];
                this.mapTileRef = i;
            }
        }
        this.statusM = 'moving';
        this.wakeTick = tick + 5;
    }

    fatigueGen() {
        if (this.isAlive === true) {
            this.fatigue++;
            if (this.fatigue > 100) {
                this.fatigue = 100;
            }
        }

    }

    sleep(mapTileRef, startTick) {
        let modifier = this.map.landscape[this.mapTileRef].modifiers.eat;
        this.statusM = 'sleeping';
        this.wakeTick = startTick + (20 / modifier);
        this.fatigue = 0;

    }

    backToWork() {
        this.statusM = 'idle';
        this.wakeTick = null;
    }


    // returns all known tiles of a minion having the terrain type passed in parameter
    getTilesFromType(terrainType) {
        let possibleDestinations = [];
        for (let j = 0; j < this.IY.map.length; j++) {
            if (this.IY.map[j] !== undefined) {
                if (this.IY.map[j].type === terrainType) {
                    possibleDestinations.push({
                        x: this.IY.map[j].x,
                        y: this.IY.map[j].y,
                    });
                }
            }
        }
        if (possibleDestinations && possibleDestinations.length) {
            return possibleDestinations;
        }
        else return false;
    }


    // will set the destination to the nearest tile having the right type of terrain
    setDestination(possibleDestinations, possibleActions, actionType) {
        let dist = [];

        for (let j = 0; j < possibleDestinations.length; j++) {
            dist.push(Math.abs(this.xCoordinate - possibleDestinations[j].x) + Math.abs(this.yCoordinate - possibleDestinations[j].y));
        }
        let it = this;

        possibleActions.survival.push(function () {

            it.IY.objective.destination.x = possibleDestinations[dist.indexOf(Math.min(...dist))].x;
            it.IY.objective.destination.y = possibleDestinations[dist.indexOf(Math.min(...dist))].y;
            it.IY.objective.destination.isTrue = true;
            it.IY.objective.action = actionType;


        });

    }

    //AI : actions every tick
    IYUpdate(tick) {
        this.tick = tick;
        this.starve();
        this.fatigueGen();
        this.updateIY();


        let minion = this;

        this.IY.possibleActions = {
            survival: [],
            gathering: [],
            building: [], //planning ?
            comfort: [],
            exploration: [],
            social: []
        };

        let possibleActions = this.IY.possibleActions;
        let mapTileRef = this.mapTileRef;
        let mapTile = this.mapTile;
        let buildings = this.buildings;

        this.updateIY();


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
                if (minion.getTilesFromType('campFire')) {
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
                if (minion.getTilesFromType('shelter')) {
                    possibleDestinations = minion.getTilesFromType('shelter');
                    minion.setDestination(possibleDestinations, possibleActions, 'sleep');
                }
                else {
                    this.IY.possibleActions.survival.push(function () {
                        minion.sleep(this.mapTileRef, tick)
                    });
                }
            }

            //GATHER
            if (this.mapTile.resources.wood > 10 && minion.inventory.wood < 100) {
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


            if (minion.inventory.wood >= 50
                && minion.inventory.fishingPole === undefined) {
                possibleActions.building.push(function () {
                    buildings.construction("fishingPole", mapTileRef, minion.id, tick)
                });
            }


            //social actions
            if (mapTile.localPop.length > 2) {

                let minions = [];
                for (let j = 0; j < mapTile.localPop.length; j++) {
                    if (mapTile.localPop[j].id !== minion.id) {
                        if (minion.IY.socialCircle[mapTile.localPop[j].id]) {
                            if ((tick - minion.IY.socialCircle[mapTile.localPop[j].id].lastMet) > 100 && this.hunger < 100) {
                                minions.push(mapTile.localPop[j]);
                            }
                        } else minions.push(mapTile.localPop[j]);
                    }
                }
                if (minions.length > 0) {

                    //creates a team to build a shelter if needs and cans are appropriate
                    for (let j = 0; j < minions.length; j++) {
                        if (minion.IY.CANS.wood === true
                            && minion.IY.NEEDS.shelter === true
                            && minions[j].IY.CANS.wood === true
                            && minions[j].IY.NEEDS.shelter === true
                            && minions[j].IY.objective.destination.isTrue === false) {
                            this.setClosestPossibleDestination(minions, "shelter");
                        }
                        else if (minion.IY.CANS.wood === true
                            && minion.IY.NEEDS.campFire === true
                            && minions[j].IY.CANS.wood === true
                            && minions[j].IY.NEEDS.campFire === true
                            && minions[j].IY.objective.destination.isTrue === false) {
                            this.setClosestPossibleDestination(minions, "campFire");
                        }
                        else if (minion.IY.CANS.wood === true
                            && minions[j].IY.CANS.wood === true
                            && minions[j].IY.objective.destination.isTrue === false) {
                            this.setClosestPossibleDestination(minions, "potatoField");
                        }
                    }

                    possibleActions.social.push(function () {
                        minion.speak(minions)
                    })


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


            if (possibleActions.social.length > 0) {
                randomDumbness(possibleActions.social)
            }
            else if (minion.IY.objective.destination.isTrue === true) {
                minion.move('objective', tick);
            }
            else if (minion.IY.objective.action == 'shelter') {
                buildings.construction("shelter", mapTileRef, minion.id, tick);
                minion.IY.objective.action = 'random';
            }
            else if (minion.IY.objective.action == 'campFire') {
                buildings.construction("campFire", mapTileRef, minion.id, tick);
                minion.IY.objective.action = 'random';
            }
            else if (minion.IY.objective.action == 'potatoField') {
                buildings.construction("potatoField", mapTileRef, minion.id, tick);
                minion.IY.objective.action = 'random';
            }
            else if (minion.IY.objective.action == 'sleep') {
                minion.sleep(this.mapTileRef, tick);
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


    //randomizes from 1 to maxRange
    randomIntInRange(maxRange) {
        return Math.floor((Math.random() * maxRange) + 1);
    }

    //will set destinations for each minion of a team
    setClosestPossibleDestination(minions, action) {

        //finds the closest buildable tile
        let possibleDestinations = false;

        let n = 0;
        while (possibleDestinations === false) {
            if (minions[n] !== undefined) {
                possibleDestinations = minions[n].getTilesFromType("grass");
                possibleDestinations = minions[n].getTilesFromType("dirt");
                n++;
            }
            else {
                possibleDestinations = false;
            }
            if (possibleDestinations === false) {
                break;
            }
        }

        if (possibleDestinations !== false) {
            let dist = [];

            //sets destination for every minion
            for (let j = 0; j < possibleDestinations.length; j++) {
                dist.push(Math.abs(this.xCoordinate - possibleDestinations[j].x) + Math.abs(this.yCoordinate - possibleDestinations[j].y));
            }
            this.IY.objective.destination.x = possibleDestinations[dist.indexOf(Math.min(...dist))].x;
            this.IY.objective.destination.y = possibleDestinations[dist.indexOf(Math.min(...dist))].y;

            for (let l = 0; l < minions.length; l++) {
                minions[l].IY.objective.destination.x = this.IY.objective.destination.x;
                minions[l].IY.objective.destination.y = this.IY.objective.destination.y;
                minions[l].IY.objective.destination.isTrue = true;
                minions[l].IY.objective.action = action;

            }
        }
        else {
            for (let l = 0; l < minions.length; l++) {
                minions[l].IY.objective.action = "random";
            }
        }

    }


}