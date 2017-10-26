"use strict";

$(function () {

    //map and seed pop parameters
    let mapSize = [12,20];
    let seedPopParam = 10;
    
    let Display = new DisplayManager();

    //generates map and pop
    let map = new MapGen(mapSize);
    let population = populate(seedPopParam, mapSize);


    let AImgr = new AIManager(population,map);
    AImgr.start();

    console.log(population);

    $('#test').on('click', function ()
    {
        console.log(population);
    });
    
    $('#checkData').on('click', function ()
    {
        AImgr.checkData();
    });

    


    //generates the adequate number of minions in random coordinates
    function populate(num, mapSize)
    {

        Display.mapViz(map);
        let pop = [];
        for (let i = 0; i <= num - 1 ; i++)
        {
            pop[i] = new Minion(i, randomIntInRange(map.x), randomIntInRange(map.y), map);
        }
        Display.minionViz(pop);
        
        return pop;

    }



    //randomizes from 1 to maxRange
    function randomIntInRange(maxRange) {
            return Math.floor((Math.random() * maxRange) + 1);
    }


});

