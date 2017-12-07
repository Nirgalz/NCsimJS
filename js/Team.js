class Team {

    constructor(pop){
        this.pop = pop;
        this.x = 0;
        this.y = 0;
        this.destination = {};
    }

    setClosestPossibleDestination(minions){
        console.log(minions);
        this.x = minions[0].xCoordinate;
        this.y = minions[0].yCoordinate;
        let possibleDestinations = [];
        for (let i = 0 ; i < minions.length ; i++){
            possibleDestinations.push(minions[i].getTilesFromType());

        }
        let dist = [];

        for (let j = 0; j < possibleDestinations.length; j++) {
            dist.push(Math.abs(this.x - possibleDestinations[j].x) + Math.abs(this.y - possibleDestinations[j].y));
        }
        console.log(possibleDestinations);
        console.log(dist);
        this.destination.x = possibleDestinations[dist.indexOf(Math.min(...dist))].x;
        this.destination.y = possibleDestinations[dist.indexOf(Math.min(...dist))].y;

        for (let l = 0 ; l < minions.length ; l++){
            minions[l].IY.objective.destination.x = this.destination.x;
            minions[l].IY.objective.destination.y = this.destination.y;
            minions[l].IY.objective.destination.isTrue = true;
        }
    }
}