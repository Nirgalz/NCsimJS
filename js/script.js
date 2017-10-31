"use strict";

$(function () {

    //map and seed pop parameters
    let mapSize = [3,3];
    let seedPopParam = 1;
    
    let Display = new DisplayManager();

    //generates map and pop
    let map = new MapGen(mapSize);
    let population = populate(seedPopParam, mapSize);


    let AImgr = new AIManager(population,map);
    AImgr.start();

    $('#test').on('click', function ()
    {
        console.log(population);
    });
    
    $('#checkData').on('click', function ()
    {
        AImgr.checkData();
    });

    $('#spawnMinion').on('click', function () {
        population.push(new Minion(population.length, randomIntInRange(map.x), randomIntInRange(map.y), [map.x,map.y]))
    });

    $('#killMinion').on('click', function () {
        population.splice(-1,1);
    });

    


    //generates the adequate number of minions in random coordinates
    function populate(num, mapSize)
    {

        Display.mapViz(map);
        let pop = [];
        for (let i = 0; i < num ; i++)
        {
            pop[i] = new Minion(i, randomIntInRange(map.x), randomIntInRange(map.y), [map.x,map.y]);
        }
        Display.minionViz(pop);
        
        return pop;

    }
    
    let refreshDisplay = setInterval(function(){
        Display.mapViz(map);
        Display.minionViz(population);

    },100);
    
    
    function showTile(x,y){
        
        $('#tileInfo').text()
    }
    
    

    //randomizes from 1 to maxRange
    function randomIntInRange(maxRange) {
            return Math.floor((Math.random() * maxRange)+1);
    }






    //pixi.js tests
    
    function setup () {
        gameScene = new Container();
        stage.addChild(gameScene);
    }
    


});

