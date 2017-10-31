class MapGen {

    constructor(mapSize) {
        this.x = mapSize[0];
        this.y = mapSize[1];
        this.landscape = this.generate();
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
                resources.water = this.randomInt();
                break;
            case 'dirt':
                resources.food = this.randomInt();
                resources.dirt = this.randomInt();
                break;
            case 'grass':
                resources.grass = this.randomInt();
                resources.food = this.randomInt();
                break;
            case 'forest':
                resources.wood = this.randomInt();
                resources.food = this.randomInt();
                break;
        }
        return resources;
    }
    
    
    ressourcesRenewal() {
        
    }

}