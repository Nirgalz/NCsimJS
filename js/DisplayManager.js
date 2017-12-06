class DisplayManager {

    constructor(map, pop) {
        this.map = map;
        this.pop = pop;
    }

    pixiDisplay(map, pop) {

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
            .add("media/faces/building.png")
            .add("media/faces/dead.png")
            .add("media/faces/gatherfood.png")
            .add("media/faces/gatherwood.png")
            .add("media/faces/idle.png")
            .add("media/faces/moving.png")
            .add("media/faces/sleeping.png")
            .add("media/faces/speak.png")
            .add("media/faces/eating.png")
            .add("media/terrain/water.png")
            .add("media/terrain/dirt.png")
            .add("media/terrain/grass.png")
            .add("media/terrain/forest.png")
            .add("media/terrain/progress-food.png")
            .add("media/terrain/potatoField.png")
            .add("media/terrain/shelter.png")
            .add("media/terrain/campFire.png")
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
                    tile.width = 50;
                    tile.height = 50;
                    tile.zOrder = 1;


                    let foodBar = new Sprite(resources["media/terrain/progress-food.png"].texture);
                    foodBar.x = map.landscape[i].x * 50;
                    foodBar.y = map.landscape[i].y * 50;
                    foodBar.width = map.landscape[i].resources.food / 2;
                    foodBar.height = 2;

                    //stage.addChild(tileInfo);
                    stage.addChild(tile);
                    stage.addChild(foodBar);


                    if (map.landscape[i].type === "forest") {
                        let woodBar = new Sprite(resources["media/terrain/progress-food.png"].texture);
                        woodBar.x = map.landscape[i].x * 50;
                        woodBar.y = map.landscape[i].y * 50 + 2;
                        woodBar.width = map.landscape[i].resources.wood / 2;
                        woodBar.height = 2;
                        stage.addChild(woodBar);

                    }

                    let minionSprite = "";
                    if (map.landscape[i].localPop.length > 0) {
                        let localPop = map.landscape[i].localPop;
                        for (let n = 0; n < localPop.length; n++) {
                            let status = localPop[n].statusM.split(" ");

                            minionSprite = "media/faces/" + status[0] + ".png";

                            let face = new Sprite(
                                resources[minionSprite].texture
                            );
                            face.x = (localPop[n].xCoordinate * 50) + (n * 15);
                            face.y = (localPop[n].yCoordinate * 50) + 5;
                            face.width = 24;
                            face.height = 45;

                            stage.addChild(face);
                        }
                    }
                }

                //pop sprites
                $('#minionInfo').empty();

                for (let k = 0; k <= pop.length - 1; k++) {

                    // minion infos
                    $('#minionInfo').append('<tr><td>' + pop[k].id + '</td><td>' + pop[k].statusM + '</td><td>' + Math.floor(pop[k].health) + '</td><td>' + Math.floor(pop[k].hunger) + '</td><td>food: ' + pop[k].inventory.food + ' wood: ' + pop[k].inventory.wood + '</td><td>' + pop[k].fatigue + '</td>')
                }
                renderer.render(stage);
            });

            ticker.start();
        }
    }
}