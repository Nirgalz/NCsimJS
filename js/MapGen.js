class MapGen {

    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.landscape = this.generate();
    }

    generate() {
        let landscape = [];
        let index = 0;
        for (let i=0; i<= this.x; i++ ) {
            for (let j=0; j<= this.y; j++) {
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
                resources.fish = this.randomInt();
                resources.water = this.randomInt();
                break;
            case 'dirt':
                resources.worm = this.randomInt();
                resources.dirt = this.randomInt();
                break;
            case 'grass':
                resources.grass = this.randomInt();
                resources.sheep = this.randomInt();
                break;
            case 'forest':
                resources.wood = this.randomInt();
                resources.boar = this.randomInt();
                resources.berry = this.randomInt();
                break;
        }
        return resources;
    }

}