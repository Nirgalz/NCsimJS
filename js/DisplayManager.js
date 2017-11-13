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

//http://pixijs.io/examples/#/display/zorder.js
    pixiDisplay(map, pop) {

        //pixi.js tests


        //Create the renderer

        let stage = new PIXI.Container();
        let renderer = PIXI.autoDetectRenderer(500, 500);
        let loader = PIXI.loader;
        let resources = PIXI.loader.resources;
        let Sprite = PIXI.Sprite;


        //timer stuff
        let ticker = PIXI.ticker.shared;
        ticker.autoStart = false;
        ticker.speed = 0.1;

        ticker.stop();


        $('#pixiMap').append(renderer.view);


        loader
            .add("media/face-3-1.png")
            .add("media/face-3-4.png")
            .add("media/face-1-1.png")
            .add("media/terrain/water.png")
            .add("media/terrain/dirt.png")
            .add("media/terrain/grass.png")
            .add("media/terrain/forest.png")
            .add("media/terrain/progress-food.png")
            .add("media/terrain/potatoField.png")
            .add("media/terrain/shelter.png")
            .add("media/buildings/campFire.png")
            .load(setupPixi);


        function setupPixi() {



            //every in there will be updated
            ticker.add(function (time) {

                //resets the scene each frame
                stage.removeChildren(0, stage.children.length);



            //landscape and data

                let style = {
                    font: '15px Courier, monospace',
                    fill: '#ffffff'
                };

            for (let i = 0; i < map.landscape.length; i++) {

                //tiles
                let tile = new Sprite(resources["media/terrain/" + map.landscape[i].type + ".png"].texture);
                tile.x = map.landscape[i].x * 50;
                tile.y = map.landscape[i].y * 50;
                tile.width= 50;
                tile.height=50;
                tile.zOrder = 1;


                //data
                // let tileInfo = new PIXI.Text('food: ' + Math.floor(map.landscape[i].resources.food) + '\nwood: ' + Math.floor(map.landscape[i].resources.wood), style);
                // tileInfo.x = map.landscape[i].x * 100;
                // tileInfo.y = map.landscape[i].y * 100;
                // tileInfo.zOrder = 2;

                //tile.interactive = true;


                //tile.hitArea = new PIXI.Rectangle(map.landscape[i].x * 100, map.landscape[i].y * 100, 100, 100);
                // make circle non-transparent when mouse is over it

                // tile.on('mouseover', onOver);
                // tile.on('mouseout', onOut);
                //
                // function onOver(eventData) {
                //     this.zOrder = -1;
                // }
                //
                // function onOut(eventData) {
                //     this.zOrder = 3;
                // }

                let foodBar = new Sprite(resources["media/terrain/progress-food.png"].texture);
                foodBar.x = map.landscape[i].x * 50;
                foodBar.y = map.landscape[i].y * 50;
                foodBar.width = map.landscape[i].resources.food /2;
                foodBar.height = 2;





                //stage.addChild(tileInfo);

                stage.addChild(tile);
                stage.addChild(foodBar);


                if (map.landscape[i].type === "forest"){
                    let woodBar = new Sprite(resources["media/terrain/progress-food.png"].texture);
                    woodBar.x = map.landscape[i].x * 50;
                    woodBar.y = map.landscape[i].y * 50 + 2;
                    woodBar.width = map.landscape[i].resources.wood /2;
                    woodBar.height = 2;
                    stage.addChild(woodBar);

                }

                if (map.landscape[i].localBuilding === "campFire"){
                    let building =  new Sprite(resources["media/buildings/campFire.png"].texture);
                    building.x = (map.landscape[i].x * 50) + 10;
                    building.y = (map.landscape[i].y * 50) + 10;
                    stage.addChild(building)
                }

            }

                //deletes minions from stage children so that this
                // if (map.landscape.length !== stage.children.length) {
                //     stage.removeChildren(map.landscape.length, stage.children.length);
                // }




                //pop sprites

                $('#minionInfo').empty();
                let minionSprite = "";
                for (let k = 0; k <= pop.length - 1; k++) {


                    if (pop[k].isAlive === false) {
                        minionSprite = "media/face-3-4.png";

                    }
                    else if (pop[k].statusM === 'sleeping') {
                        minionSprite = "media/face-1-1.png";

                    }
                    else if (pop[k].isAlive === true) {
                        minionSprite = "media/face-3-1.png";

                    }


                    let face = new Sprite(
                        resources[minionSprite].texture
                    );
                    face.x = (pop[k].xCoordinate * 50) + 10;
                    face.y = (pop[k].yCoordinate * 50) + 10;

                    stage.addChild(face);

                    // minion infos
                    $('#minionInfo').append('<tr><td>' + pop[k].id + '</td><td>' + pop[k].statusM + '</td><td>' + Math.floor(pop[k].health) + '</td><td>' + Math.floor(pop[k].hunger) + '</td><td>food: ' + pop[k].inventory.food + ' wood: ' + pop[k].inventory.wood +'</td><td>' + pop[k].fatigue + '</td>')
                }

                    renderer.render(stage);

            });


            ticker.start();
        }


    }


}