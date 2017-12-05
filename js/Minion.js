class Minion {

    constructor(id, x, y, map, birthTick) {
        this.id = id;
        this.isAlive = true;
        this.birthday = birthTick;
        this.statusM = 'idle';
        this.xCoordinate = x - 1;
        this.yCoordinate = y - 1;
        this.health = 100;
        this.hunger = 0;
        this.fatigue = 0;
        this.inventory = {wood: 0, food: 20};
        this.map = map;
        this.wakeTick = null;
        //IY is the 'dialogue interface' of minions as well as their 'consciousness' of their environment
        this.IY = {
            map: [],
            socialCircle: [],
            NEEDS: {},
            CANS: {},
            objective: {
                destination: {isTrue: false, x:null,y:null},
                action: 'random'
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

        //sleep/shelter
        this.IY.NEEDS.sleep = (this.fatigue === 100);

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
        console.log(speech);
        //list of already met minions
        for (let l = 0; l < minions.length; l++) {
            if (minions[l].id !== this.id) {
                this.IY.socialCircle[minions[l].id] = minions[l];
            }
        }

        //console.log(speech);
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
        this.inventory.food -= 10 ;
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
        let getToDestination = function ( it) {
            let distance = {
                xDist: it.IY.objective.destination.x - it.xCoordinate ,
                yDist: it.IY.objective.destination.y - it.yCoordinate
            };
            it.xCoordinate += Math.sign(distance.xDist);
            it.yCoordinate += Math.sign(distance.yDist);
            it.wakeTick = tick + 5;
            if (it.xCoordinate === it.IY.objective.destination.x && it.yCoordinate === it.IY.objective.destination.y){
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
        let modifier = this.map.landscape[mapTileRef].modifiers.eat;
        this.statusM = 'sleeping';
        this.wakeTick = startTick + (20 / modifier);
        this.fatigue = 0;

    }

    backToWork() {
        this.statusM = 'idle';
        this.wakeTick = null;
    }


    //randomizes from 1 to maxRange
    randomIntInRange(maxRange) {
        return Math.floor((Math.random() * maxRange) + 1);
    }


}