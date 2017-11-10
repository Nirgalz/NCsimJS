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
        let renderer = PIXI.autoDetectRenderer(500, 500);
        let loader = PIXI.loader;
        let resources = PIXI.loader.resources;
        let Sprite = PIXI.Sprite;

        //timer stuff
        let ticker = PIXI.ticker.shared;
        ticker.autoStart = false;

        let firstTick = true;

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
            .add("media/buildings/campFire.png")
            .load(setupPixi);


        function setupPixi() {


            let style = {
                font: '15px Courier, monospace',
                fill: '#ffffff'
            };

            for (let i = 0; i < map.landscape.length; i++) {

                //tiles
                let tile = new Sprite(resources["media/terrain/" + map.landscape[i].type + ".png"].texture);
                tile.x = map.landscape[i].x * 100;
                tile.y = map.landscape[i].y * 100;


                //makes tiles interactive and alpha- on hover
                tile.interactive = true;


                //tile.hitArea = new PIXI.Rectangle(map.landscape[i].x * 100, map.landscape[i].y * 100, 100, 100);
                // make circle non-transparent when mouse is over it

                tile.on('mouseover', onOver);
                tile.on('mouseout', onOut);

                function onOver(eventData) {
                    this.alpha = 0.5;
                }

                function onOut(eventData) {
                    this.alpha = 1;
                }

                stage.addChild(tile);

            }



            //every in there will be updated
            ticker.add(function (time) {

                //resets the scene each frame

                if (firstTick === false){
                    stage.removeChildren(map.landscape.length, stage.children.length);

                }
                firstTick = false;

                //food bars on tiles and wood


                //landscape and data

                let style = {
                    font: '15px Courier, monospace',
                    fill: '#ffffff'
                };

                for (let i = 0; i < map.landscape.length; i++) {



                    //data
                    let tileInfo = new PIXI.Text('food: ' + Math.floor(map.landscape[i].resources.food) + '\nwood: ' + Math.floor(map.landscape[i].resources.wood), style);
                    tileInfo.x = map.landscape[i].x * 100;
                    tileInfo.y = map.landscape[i].y * 100;

                    stage.addChild(tileInfo);


                    if (map.landscape[i].localBuilding === "campFire") {
                        let building = new Sprite(resources["media/buildings/campFire.png"].texture);
                        building.x = (map.landscape[i].x * 100) + 20;
                        building.y = (map.landscape[i].y * 100) + 20;
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
                    face.x = (pop[k].xCoordinate * 100) + 50;
                    face.y = (pop[k].yCoordinate * 100) + 50;

                    stage.addChild(face);

                    // minion infos
                    $('#minionInfo').append('<tr><td>' + pop[k].id + '</td><td>' + pop[k].statusM + '</td><td>' + Math.floor(pop[k].health) + '</td><td>' + Math.floor(pop[k].hunger) + '</td><td>food: ' + pop[k].inventory.food + ' wood: ' + pop[k].inventory.wood + '</td><td>' + pop[k].fatigue + '</td>')
                }

                // start animating
                animate();

                function animate() {
                    requestAnimationFrame(animate);
                    // render the root container
                    renderer.render(stage);
                }
            });


            ticker.start();
        }


    }


}