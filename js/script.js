"use strict";

$(function () {
    
    let Display = {};
    let map ={};
    let population = {};
    let AImgr = {};
    let TimeMgr = {};
    let simSpeedParam = [1];
    
    function initSim(mapSize, seedPopParam, simSpeedParam){
        
 //map and seed pop parameters
        Display = new DisplayManager();
        //generates map and pop
        map = new MapGen(mapSize);
        population = populate(seedPopParam, map);


        AImgr = new AIManager(population,map, simSpeedParam, TimeMgr);
        AImgr.start();
        
        TimeMgr = new TimeManager(simSpeedParam, map, population, AImgr);
        TimeMgr.play();
    }
    
    initSim([4,7] , 3 , 10 );
  
    

  
    $('#checkData').on('click', function ()
    {
        AImgr.checkData();
    });

    $('#spawnMinion').on('click', function () {
        population.push(new Minion(population.length, randomIntInRange(map.x), randomIntInRange(map.y), map, simSpeedParam))
    });

    $('#killMinion').on('click', function () {
        population.splice(-1,1);
    });
    
    $('#genBtn').on('click', function(e) {
        e.preventDefault();
        let x = $('#xmax').val();
        let y = $('#ymax').val();
        let seed = $('#seed').val();
        
        initSim([x,y], seed, 10);
    })
    
    
    $('#speedMinus').on('click', function() {
        TimeMgr.speedFactor +=1;
        $('#speedometer').html(TimeMgr.speedCalc()) ;
    })
    
    $('#speedPlus').on('click', function() {
        TimeMgr.speedFactor -=1;
        $('#speedometer').html(TimeMgr.speedCalc()) ;
    })
    
    $('#speedPause').on('click', function() {
        if (TimeMgr.pause === true) {
            TimeMgr.pause = false;
            TimeMgr.play();
        } else if (TimeMgr.pause === false){
             TimeMgr.pause = true;
        }
       
    })

    


    //generates the adequate number of minions in random coordinates
    function populate(num)
    {

        Display.mapViz(map);
        let pop = [];
        for (let i = 0; i < num ; i++)
        {
            pop[i] = new Minion(i, randomIntInRange(map.x), randomIntInRange(map.y), map, 1);
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

