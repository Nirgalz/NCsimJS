class AIManager {

    constructor(pop, map) {
        this.pop = pop;
        this.map = map;
        this.tickRate = 10;
    }

    checkData() {
        console.log(this.pop);
        console.log(this.map);
    }

    start() {
        let AIData = this;
        let inter = setInterval(function () {
            for (let l = 0; l <= AIData.pop.length - 1; l++) {
                let minion = AIData.pop[l];
                let tileFood = AIData.map.landscape[AIData.getMapTile(AIData.pop[l])].resources.food;

                //When minions has more than 90 hunger
                if (minion.hunger >= 90 && minion.isAlive === true) {

                    if (minion.inventory.food >= 10) {
                        minion.eat(10);
                        minion.inventory.food -= 10;
                    }
                    else {
                        if (tileFood > 10) {
                            tileFood -= 20;
                            minion.gather(10);
                        }
                        else {
                            minion.move();
                        }
                    }
                }
                else if (minion.hunger < 90 && minion.isAlive === true) {
                    if (minion.inventory.food < 100 && tileFood >20){
                        minion.inventory.food += 10;
                        tileFood -= 10;
                        minion.move();

                    } else if (tileFood < 100) {
                        minion.status = 'planting food';
                        tileFood += 1;
                    }
                    else if (tileFood >= 100) {
                        tileFood = 100;
                        minion.move();
                    }
                }
            }
        }, AIData.tickRate)
    }

    getMapTile(minion) {
        for (let tile = 0; tile <= this.map.landscape.length; tile++) {

            if (minion.xCoordinate === this.map.landscape[tile].x && minion.yCoordinate === this.map.landscape[tile].y) {
                return tile;
            }
        }
    }
}