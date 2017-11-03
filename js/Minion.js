class Minion{

    constructor(id, x, y, map, speed)
    {
        this.id = id;
        this.isAlive = true;
        this.status = 'idle';
        this.xCoordinate = x-1;
        this.yCoordinate = y-1;
        this.health = 50;
        this.hunger = 50;
        this.inventory = {wood:0,food:0};
        this.birthday = new Date().getTime();
        this.starve();
        this.map = map;
        this.simSpeed = speed;
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
                console.log(minion.id + " has died from starving after " + minion.getAge());
                clearInterval(inter);
                minion.isAlive = false;
            } else {
                minion.hunger +=  1 ;
                if (minion.hunger > 100) minion.hunger = 100;
                if (minion.hunger >= 100) minion.health -= 1 ;
            }
        }, this.simSpeed)
    }
    
    eat(quantity)
    {
        this.hunger -= quantity;
        this.health += quantity;
        if (this.health > 100) this.health = 100;
        this.status = 'eating';
    }

    gather( quantity)
    {
        this.inventory.food += quantity/10;
        this.status = 'gathering';
    }
    
    
    move()
    {
        for (var i = 0; i < this.map.landscape.length; i++) {
            if (this.xCoordinate === this.map.landscape[i].x && this.yCoordinate === this.map.landscape[i].y){
                for (var j = 0; j < this.map.landscape[i].localPop.length; j++) {
                    if (this.map.landscape[i].localPop[j].id === this.id){
                        this.map.landscape[i].localPop.splice(j,1);
                    }
                }
            }
        }
        
        this.xCoordinate = this.randomIntInRange(this.map.x) - 1;
        this.yCoordinate = this.randomIntInRange(this.map.y) - 1;
        
        for (var i = 0; i < this.map.landscape.length; i++) {
            if (this.xCoordinate === this.map.landscape[i].x && this.yCoordinate === this.map.landscape[i].y){
                this.map.landscape[i].localPop.push(this);
            }
        }
        
        
    }
    
    //randomizes from 1 to maxRange
    randomIntInRange(maxRange) {
            return Math.floor((Math.random() * maxRange) + 1);
    }






}