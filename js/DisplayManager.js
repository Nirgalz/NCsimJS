class DisplayManager {

    constructor(map, pop) {
        this.map = map;
        this.pop = pop;
        // this.stage = new PIXI.Container();
        // this.renderer = PIXI.autoDetectRenderer(512, 512);
        // this.loader = PIXI.loader;
        // this.resources = PIXI.loader.resources;
        // this.Sprite = PIXI.Sprite;
        //this.pixiDisplay(this.map, this.pop);

    }



    pixiDisplay(map, pop) {

        //pixi.js tests


        //Create the renderer

        let stage = new PIXI.Container();
        let renderer = PIXI.autoDetectRenderer(512, 512);
        let loader = PIXI.loader;
        let resources = PIXI.loader.resources;
        let Sprite = PIXI.Sprite;


//Add the canvas to the HTML document
        $('#pixiMap').append(renderer.view);

//Create a container object called the `stage`

        loader
            .add("media/face-3-1.png")
            .add("media/terrain/water.png")
            .add("media/terrain/dirt.png")
            .add("media/terrain/grass.png")
            .add("media/terrain/forest.png")
            .load(setupPixi);

        function setupPixi() {

            for (let i = 0; i < map.landscape.length; i++) {

                let tile = new Sprite(resources["media/terrain/" + map.landscape[i].type + ".png"].texture);
                tile.x = map.landscape[i].x * 100;
                tile.y = map.landscape[i].y * 100;
                stage.addChild(tile);
            }

            //pop sprites


            for (let k = 0; k <= pop.length - 1; k++) {

                if (pop[k].isAlive === true) {
                    let face = new Sprite(
                        resources["media/face-3-1.png"].texture
                    );
                    face.x = pop[k].xCoordinate * 100;
                    face.y = pop[k].yCoordinate * 100;

                    stage.addChild(face);

                }
                else if (pop[k].isAlive === false) {

                }

                //$('#minionInfo').append('<tr><td>'+pop[k].id+'</td><td>'+pop[k].status+'</td><td>'+Math.floor(pop[k].health)+'</td><td>'+Math.floor(pop[k].hunger)+'</td><td>'+pop[k].inventory.food+'</td><td>'+pop[k].fatigue+'</td>')
            }

//Tell the `renderer` to `render` the `stage`
            renderer.render(stage);
        }


    }





    pixiLoad() {
        //terrain sprites
        for (let i = 0; i < this.map.landscape.length; i++) {

            let tile = new this.Sprite(this.resources["media/terrain/" + this.map.landscape[i].type + ".png"].texture);
            tile.x = this.map.landscape[i].x * 100;
            tile.y = this.map.landscape[i].y * 100;
            this.stage.addChild(tile);
        }

        //pop sprites


        for (let k = 0; k <= this.pop.length - 1; k++) {

            if (this.pop[k].isAlive === true) {
                let face = new this.Sprite(
                    this.resources["media/face-3-1.png"].texture
                );
                face.x = this.pop[k].xCoordinate * 100;
                face.y = this.pop[k].yCoordinate * 100;

                this.stage.addChild(face);

            }
            else if (this.pop[k].isAlive === false) {

            }

            //$('#minionInfo').append('<tr><td>'+pop[k].id+'</td><td>'+pop[k].status+'</td><td>'+Math.floor(pop[k].health)+'</td><td>'+Math.floor(pop[k].hunger)+'</td><td>'+pop[k].inventory.food+'</td><td>'+pop[k].fatigue+'</td>')
        }

        return this.stage;
    }


    //map visualisation
    mapViz(map) {
        $('#map').empty();
        for (let i = 0; i <= map.x; i++) {
            $('#map').append('<tr id="row-' + i + '"></tr>');
            for (let j = 0; j <= map.y; j++) {
                $('#row-' + i).append('<td onclick="showTile(' + i + ',' + j + ')" id=tile-' + i + '-' + j + ' ></td>')
            }
        }

        map.landscape.forEach(function (elem) {
            $('#tile-' + elem.x + '-' + elem.y).addClass(elem.type).append('<progress value="' + elem.resources.food + '" max="100"></progress>');
        })
    }

    minionViz(pop) {
        $('#minionInfo').empty();
        for (let k = 0; k <= pop.length - 1; k++) {
            let coords = '#tile-' + pop[k].xCoordinate + '-' + pop[k].yCoordinate;
            if (pop[k].isAlive === true) {

                $(coords).append('<img src="media/face-3-1.png" id=minion-' + (k + 1) + '>');
                // $(coords).append('<i class="fa fa-user-circle" aria-hidden="true" id=minion-'+(k +1) +'></i>') ;
            }
            else if (pop[k].isAlive === false) {
                $(coords).append('<img src="media/face-3-4.png" id=minion-' + (k + 1) + '>');
                //$(coords).append('<i class="fa fa-plus-square" aria-hidden="true" id=minion-'+(k +1) +'></i>') ;
            }

            $('#minionInfo').append('<tr><td>' + pop[k].id + '</td><td>' + pop[k].status + '</td><td>' + Math.floor(pop[k].health) + '</td><td>' + Math.floor(pop[k].hunger) + '</td><td>' + pop[k].inventory.food + '</td><td>' + pop[k].fatigue + '</td>')
        }
    }
}