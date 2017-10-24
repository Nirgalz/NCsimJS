class Minion{

    constructor(id){
        this.id = id;
        this.health = 50;
        this.hunger = 50;
        this.thirst = 10;
        this.inventory = {};
        this.birthday = new Date().getTime();
        this.starve();
    }

    getAge() {
        let nowTime = new Date().getTime();
        let t = nowTime - this.birthday;

        let h = ('0' + Math.floor(t / 3600000)).slice(-2);
        let m = ('0' + Math.floor(t % 3600000 / 60000)).slice(-2);
        let s = ('0' + Math.floor(t % 60000 / 1000)).slice(-2);
        return  h + ':' + m + ':' + s;
    }

    starve() {
        let minion = this;
        let inter = setInterval(function () {
            if (minion.health <= 0) {
                console.log(minion.id + " has died from starving");
                clearInterval(inter);
                minion = null;
            } else {
                minion.health = minion.health - ((minion.hunger /100) + (minion.thirst /1000));
            }
        }, 1000)
    }






}