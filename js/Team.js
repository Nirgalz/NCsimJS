class Team {

    constructor(pop, map) {
        this.pop = pop;
        this.map = map;
        this.x = 0;
        this.y = 0;
        this.destination = {};
    }

    //will set destinations for each minion of a team
    setClosestPossibleDestination(minions) {
        this.x = minions[0].xCoordinate;
        this.y = minions[0].yCoordinate;

        //finds the closest buildable tile
        let possibleDestinations = false;
        let n = 0;
        while (possibleDestinations === false){
            if (minions[n] !== undefined){
                possibleDestinations = minions[n].getTilesFromType("grass");
                possibleDestinations = minions[n].getTilesFromType("dirt");
                n++;
            }
            else {
                for (let j = 0 ; j < this.map.landscape.length ; j++){
                    if (this.map.landscape[j].type === "grass" || this.map.landscape[j].type === "dirt"){
                        possibleDestinations = this.map.landscape[j];
                    }
                }
            }
            if (possibleDestinations === false){
                break;
            }
        }

        if (possibleDestinations !== false) {
            let dist = [];

            //sets destination for every minion
            for (let j = 0; j < possibleDestinations.length; j++) {
                dist.push(Math.abs(this.x - possibleDestinations[j].x) + Math.abs(this.y - possibleDestinations[j].y));
            }
            this.destination.x = possibleDestinations[dist.indexOf(Math.min(...dist))].x;
            this.destination.y = possibleDestinations[dist.indexOf(Math.min(...dist))].y;

            for (let l = 0; l < minions.length; l++) {
                minions[l].IY.objective.destination.x = this.destination.x;
                minions[l].IY.objective.destination.y = this.destination.y;
                minions[l].IY.objective.destination.isTrue = true;
            }
        }
        else {
            for (let l = 0; l < minions.length; l++) {
                minions[l].IY.objective.action = "random";
            }
        }

    }
}