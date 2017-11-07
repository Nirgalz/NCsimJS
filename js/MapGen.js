class MapGen {

    constructor(mapSize) {
        this.x = mapSize[0];
        this.y = mapSize[1];
        this.landscape = this.generate();
        this.resourcesRenewal();
    }

    generate() {
        let landscape = [];
        let index = 0;
        for (let i=0; i< this.x; i++ ) {
            for (let j=0; j< this.y; j++) {
                landscape[index] = {};
                landscape[index].x = i;
                landscape[index].y = j;
                landscape[index].type = this.randomTiles();
                landscape[index].resources = this.resourcesGen(landscape[index].type);
                landscape[index].localPop = [];
                landscape[index].localBuilding = "";

                index++;
            }
        }
        return landscape;
    }

    randomTiles() {
        let tileType = '';

        let randomInt = this.randomInt();
        if (randomInt <= 25) {
            tileType = 'water';
        } else if (randomInt <= 50) {
            tileType = 'dirt';
        } else if (randomInt <= 75) {
            tileType = 'grass';
        } else {
            tileType = 'forest';
        }
        return tileType;
    }

    randomInt(){
        return Math.floor((Math.random() * 100) + 1);
    }

    resourcesGen(type){
        let resources = {};
        switch (type){
            case 'water':
                resources.food = this.randomInt();
                resources.wood = 0;
                break;
            case 'dirt':
                resources.food = 0;
                resources.wood = 0;
                break;
            case 'grass':
                resources.wood = 0;
                resources.food = this.randomInt();
                break;
            case 'forest':
                resources.wood = this.randomInt();
                resources.food = this.randomInt();
                break;
        }
        return resources;
    }
    
    
    resourcesRenewal() {
        let map = this;
           for (let i = 0 ; i< map.landscape.length; i++ ) {
               if (map.landscape[i].type === 'water'){
                   map.landscape[i].resources.food += 0.1;
               }
               if (map.landscape[i].type === 'forest'){
                   map.landscape[i].resources.food += 0.1;
                   map.landscape[i].resources.wood += 0.1;
               }
               if (map.landscape[i].localBuilding === 'potatoField'){
                   map.landscape[i].resources.food += 1;
               }
               if (map.landscape[i].resources.food > 100) map.landscape[i].food = 100;
                if (map.landscape[i].resources.wood > 100) map.landscape[i].wood = 100;
           }
    }
}