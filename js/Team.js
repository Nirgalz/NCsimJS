class Team {

    constructor(pop) {
        this.pop = pop;
        this.x = 0;
        this.y = 0;
        this.destination = {};
    }

    //will set destinations for each minion of a team
    setClosestPossibleDestination(minions) {
        console.log(minions);
        this.x = minions[0].xCoordinate;
        this.y = minions[0].yCoordinate;

        //finds the closest buildable tile
        let possibleDestinations = minions[0].getTilesFromType("grass");
        if (possibleDestinations === false){
            possibleDestinations = minions[0].getTilesFromType("dirt");
        }


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
}