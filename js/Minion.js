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
            CANS: {}
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
        if (this.inventory.food < 10 && this.hunger > 90) {
            this.IY.NEEDS.food = true;
        }
        else this.IY.NEEDS.food = false;

        //sleep/shelter
        if (this.fatigue > 100) {
            this.IY.NEEDS.sleep = true;
        }
        else this.IY.NEEDS.sleep = false;


        //CANS
        //food
        if (this.inventory.food > 50) {
            this.IY.CANS.food = true;
        }
        else this.IY.CANS.food = false;

        //wood
        if (this.inventory.wood === 100) {
            this.IY.CANS.wood = true;
        }
        else this.IY.CANS.wood = true;

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

    eat(mapTileRef, quantity, tick) {
        let modifier = this.map.landscape[mapTileRef].modifiers.eat;
        this.inventory.food -= quantity * modifier;
        this.hunger = 0;
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


    move(direction, tick) {

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

        let getToDestination = function (direction, it) {

        };


        if (direction === "random") {
            randomPossibleDirection(this);
        }
        else {
            getToDestination(direction, this);
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

    }


    //randomizes from 1 to maxRange
    randomIntInRange(maxRange) {
        return Math.floor((Math.random() * maxRange) + 1);
    }


}