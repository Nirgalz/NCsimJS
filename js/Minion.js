class Minion{

    constructor(id, x, y, map)
    {
        this.id = id;
        this.isAlive = true;
        this.activity = 'idle';
        this.xCoordinate = x;
        this.yCoordinate = y;
        this.health = 50;
        this.hunger = 50;
        this.thirst = 10;
        this.inventory = {wood:0,food:0};
        this.birthday = new Date().getTime();
        this.starve();
        this.mapLimits = map;
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
        let inter = setInterval(function () {
            if (minion.health <= 0) {
                console.log(minion.id + " has died from starving");
                clearInterval(inter);
                minion.isAlive = false;
            } else {
                minion.health = minion.health - (minion.hunger /300);
                minion.hunger = minion.hunger +  (1 - (minion.health / 100));
            }
        }, 100)
    }
    
    eat(quantity)
    {
        this.hunger = this.hunger - (quantity/10);
        if (this.hunger <0) this.hunger = 0;
        this.health = this.health + (quantity/10);
        if (this.health > 100) this.health = 100;
        this.activity = 'eating';
    }

    gather(quantity)
    {
        this.inventory["food"] = this.inventory["food"] + quantity;
        this.activity = 'gathering';
    }
    
    
    move()
    {
        this.xCoordinate = this.randomIntInRange(this.mapLimits[0])
        this.yCoordinate = this.randomIntInRange(this.mapLimits[1])
    }
    
    //randomizes from 1 to maxRange
    randomIntInRange(maxRange) {
            return Math.floor((Math.random() * maxRange) + 1);
    }






}