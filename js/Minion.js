class Minion{

    constructor(id, x, y, map, birthTick)
    {
        this.id = id;
        this.isAlive = true;
        this.birthday = birthTick;
        this.statusM = 'idle';
        this.xCoordinate = x-1;
        this.yCoordinate = y-1;
        this.health = 50;
        this.hunger = 50;
        this.fatigue = 50;
        this.inventory = {wood:50,food:0};
        this.map = map;
        this.wakeTick = null;
    }

    getAge(presentTick)
    {
        return  presentTick - this.birthday ;
    }

    starve()
    {
        let minion = this;
       
            if (minion.health <= 0) {
                console.log(minion.id + " has died from starving");
                minion.isAlive = false;
            }
            else if (minion.isAlive === true){
                minion.hunger +=  1 ;
                if (minion.hunger > 100) minion.hunger = 100;
                if (minion.hunger >= 100) minion.health -= 0.1 ;
            }
     
    }
    
    eat(quantity)
    {
        this.hunger = 0;
        this.health = 100;
        if (this.health > 100) this.health = 100;
        this.statusM = 'eating';
    }

    gather(quantity, type)
    {
        this.inventory[type] += quantity/10;
        this.statusM = 'gathering ' + type;
    }
    
    
    move()
    {
        for (let i = 0; i < this.map.landscape.length; i++) {
            if (this.xCoordinate === this.map.landscape[i].x && this.yCoordinate === this.map.landscape[i].y){
                for (let j = 0; j < this.map.landscape[i].localPop.length; j++) {
                    if (this.map.landscape[i].localPop[j].id === this.id){
                        this.map.landscape[i].localPop.splice(j,1);
                    }
                }
            }
        }
        
        this.xCoordinate = this.randomIntInRange(this.map.x) - 1;
        this.yCoordinate = this.randomIntInRange(this.map.y) - 1;
        
        for (let i = 0; i < this.map.landscape.length; i++) {
            if (this.xCoordinate === this.map.landscape[i].x && this.yCoordinate === this.map.landscape[i].y){
                this.map.landscape[i].localPop.push(this);
            }
        }
    }

    fatigueGen()
    {
        if (this.isAlive === true)
        {
            this.fatigue++;
            if (this.fatigue > 100)
            {
                this.fatigue = 100;
                this.health -= 0.1 ;
            }
        }

    }
    
    sleep(startTick)
    {
        this.statusM = 'sleeping';
        this.wakeTick = startTick + 10;
    }

    wakeUp()
    {
        this.fatigue = 0;

    }
    
    //randomizes from 1 to maxRange
    randomIntInRange(maxRange) {
            return Math.floor((Math.random() * maxRange) + 1);
    }






}