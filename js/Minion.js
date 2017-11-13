class Minion{

    constructor(id, x, y, map, birthTick)
    {
        this.id = id;
        this.isAlive = true;
        this.birthday = birthTick;
        this.statusM = 'idle';
        this.xCoordinate = x-1;
        this.yCoordinate = y-1;
        this.health = 100;
        this.hunger = 0;
        this.fatigue = 0;
        this.inventory = {wood:0,food:20};
        this.map = map;
        this.wakeTick = null;
        this.personalMap = [];

        for (let tile = 0 ; tile < map.landscape.length ; tile++)
        {
            if (map.landscape[tile].x === x && map.landscape[tile].y === y)
            {
                this.personalMap[tile] = map.landscape[tile];
            }
        }
    }

    getAge(presentTick)
    {
        return  presentTick - this.birthday ;
    }

    starve()
    {
        let minion = this;
       
            if (minion.health <= 0) {
                minion.statusM = 'died starving';
                minion.isAlive = false;
            }
            else if (minion.isAlive === true){
                minion.hunger +=  1 ;
                if (minion.hunger > 100) minion.hunger = 100;
                if (minion.hunger >= 100) minion.health -= 0.1 ;
            }
     
    }
    
    eat(mapTileRef, quantity, tick)
    {
        let modifier = this.map.landscape[mapTileRef].modifiers.eat;
        this.inventory.food -= quantity * modifier;
        this.hunger = 0;
        this.health = 100;
        if (this.health > 100) this.health = 100;
        this.statusM = 'eating';
        this.wakeTick = tick + 10;

    }

    gather(mapTileRef, quantity, type, tick)
    {
        this.inventory[type] += quantity;
        this.map.landscape[mapTileRef].resources[type] -= 10;

        this.statusM = 'gathering ' + type;
        this.wakeTick = tick + 10;

    }
    
    
    move(direction, tick)
    {

        //removes minion from tile
        for (let i = 0; i < this.map.landscape.length; i++) {
            if (this.xCoordinate === this.map.landscape[i].x && this.yCoordinate === this.map.landscape[i].y){
                for (let j = 0; j < this.map.landscape[i].localPop.length; j++) {
                    if (this.map.landscape[i].localPop[j].id === this.id){
                        this.map.landscape[i].localPop.splice(j,1);
                    }
                }
            }
        }

        //random direction
        let randomPossibleDirection = function(it){
            let randomNum = it.randomIntInRange(4);
            switch (randomNum) {
                case 1:
                    if (it.xCoordinate + 1 < it.map.x){
                        it.xCoordinate++;
                    } else {
                        randomPossibleDirection(it);
                    }
                    break;
                case 2:
                    if (it.xCoordinate - 1 >= 0){
                        it.xCoordinate--;
                    } else {
                        randomPossibleDirection(it);
                    }
                    break;
                case 3:
                    if (it.yCoordinate + 1 < it.map.y){
                        it.yCoordinate++;
                    } else {
                        randomPossibleDirection(it);
                    }
                    break;
                case 4:
                    if (it.yCoordinate - 1 >= 0){
                        it.yCoordinate--;
                    } else {
                        randomPossibleDirection(it);
                    }
                    break;
                    
    
            }

        };


        if (direction === "random"){
            randomPossibleDirection(this);

        }

        //add minion to tile
        for (let i = 0; i < this.map.landscape.length; i++) {
            if (this.xCoordinate === this.map.landscape[i].x && this.yCoordinate === this.map.landscape[i].y){
                this.map.landscape[i].localPop.push(this);
                this.personalMap[i] = this.map.landscape[i];
            }
        }
        this.statusM = 'moving';
        this.wakeTick = tick + 5;
    }

    fatigueGen()
    {
        if (this.isAlive === true)
        {
            this.fatigue++;
            if (this.fatigue > 100)
            {
                this.fatigue = 100;
            }
        }

    }
    
    sleep(mapTileRef, startTick)
    {
        let modifier = this.map.landscape[mapTileRef].modifiers.eat;
        this.statusM = 'sleeping';
        this.wakeTick = startTick + (20 / modifier);
        this.fatigue = 0;

    }

    backToWork(){
        this.statusM = 'idle';

    }


    //randomizes from 1 to maxRange
    randomIntInRange(maxRange) {
            return Math.floor((Math.random() * maxRange) + 1);
    }






}