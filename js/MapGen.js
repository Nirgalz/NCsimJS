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
                index++;
            }
        }
        return landscape;
    }

    randomTiles() {
        let tileType = '';

        let randomInt = Math.floor((Math.random() * 100) + 1);
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

}