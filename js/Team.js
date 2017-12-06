class Team {

    constructor(minions, objective){
        this.minions = minions;
        this.objective = objective;
        this.x = x;
        this.y = y;
        this.destination = {};
        this.setClosestPossibleDestination();
    }

    setClosestPossibleDestination(){
        let possibleDestinations = [];
        for (let i = 0 ; i < this.minions.length ; i++){
            possibleDestinations.push(this.minions.getTilesFromType());

        }
        let dist = [];

        for (let j = 0; j < possibleDestinations.length; j++) {
            dist.push(Math.abs(this.x - possibleDestinations[j].x) + Math.abs(this.y - possibleDestinations[j].y));
        }

        this.destination.x = possibleDestinations[dist.indexOf(Math.min(...dist))].x;
        this.destination.y = possibleDestinations[dist.indexOf(Math.min(...dist))].y;
        this.destination.isTrue = true;
    }
}