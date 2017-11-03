class Minion{

    constructor(id, x, y, map, speed)
    {
        this.id = id;
        this.isAlive = true;
        this.statusM = 'idle';
        this.xCoordinate = x-1;
        this.yCoordinate = y-1;
        this.health = 50;
        this.hunger = 50;
        this.fatigue = 50;
        this.inventory = {wood:0,food:0};
        this.birthday = new Date().getTime();
        this.map = map;
    }

    getAge()
    {
        let nowTime = new Date().getTime();
        let t = nowTime - this.birthday;

        let h = ('0' + Math.floor(t / 3600000)).slice(-2);
        let m = ('0' + Math.floor(t % 3600000 / 60000)).slice(-2);
        let s = ('0' + Math.floor(t % 60000 / 1000)).slice(-2);
        return  h + ':' + m + ':' + s;
    }

    starve()
    {
        let minion = this;
       
            if (minion.health <= 0) {
                console.log(minion.id + " has died from starving after " + minion.getAge());
                minion.isAlive = false;
            } else {
                minion.hunger +=  1 ;
                if (minion.hunger > 100) minion.hunger = 100;
                if (minion.hunger >= 100) minion.health -= 1 ;
            }
     
    }
    
    eat(quantity)
    {
        this.hunger -= quantity;
        this.health += quantity;
        if (this.health > 100) this.health = 100;
        this.statusM = 'eating';
    }

    gather( quantity)
    {
        this.inventory.food += quantity/10;
        this.statusM = 'gathering';
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
        this.fatigue++;
        if (this.fatigue > 100)
        {
            this.fatigue = 100;
            this.health -= 1 ;
        }
    }
    
    sleep(duration)
    {
        this.statusM = 'sleeping';
        this.fatigue = 0; //got to be progressive (case of interrupted sleep ?)
        // todo: time to wake = duration, wake function
    }
    
    //randomizes from 1 to maxRange
    randomIntInRange(maxRange) {
            return Math.floor((Math.random() * maxRange) + 1);
    }






}