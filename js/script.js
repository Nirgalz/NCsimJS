"use strict";

$(function () {

    let Display = {};
    let map = {};
    let population = {};
    let AImgr = {};
    let TimeMgr = {};
    let simSpeedParam = [1];
    let Buildings = {};

    function initSim(mapSize, seedPopParam, simSpeedParam) {

        //map and seed pop parameters
        Display = new DisplayManager();
        //generates map and pop
        map = new MapGen(mapSize);
        population = populate(seedPopParam, map);

        Buildings = new Build(map, population);
        AImgr = new AIManager(population, map, Buildings);
        AImgr.startRandomPossibleActions();

        TimeMgr = new TimeManager(simSpeedParam, map, population, AImgr);
        TimeMgr.play();
    }

    //params mapSize, seedPopParam, simSpeedParam
    initSim([10, 10], 6, 10);


    $('#checkData').on('click', function () {
        AImgr.checkData();
    });

    $('#spawnMinion').on('click', function () {
        population.push(new Minion(population.length, randomIntInRange(map.x), randomIntInRange(map.y), map, simSpeedParam))
    });

    $('#killMinion').on('click', function () {
        population.splice(-1, 1);
    });

    $('#genBtn').on('click', function (e) {
        e.preventDefault();
        let x = $('#xmax').val();
        let y = $('#ymax').val();
        let seed = $('#seed').val();

        initSim([x, y], seed, 10);
    })


    $('#speedMinus').on('click', function () {
        TimeMgr.speedFactor += 1;
        $('#speedometer').html(TimeMgr.speedCalc());
    })

    $('#speedPlus').on('click', function () {
        TimeMgr.speedFactor -= 1;
        $('#speedometer').html(TimeMgr.speedCalc());
    })

    $('#speedPause').on('click', function () {
        if (TimeMgr.pause === true) {
            TimeMgr.pause = false;
            TimeMgr.play();
        } else if (TimeMgr.pause === false) {
            TimeMgr.pause = true;
        }
    })
    
    $('#checkIY').on('click', function() {
        let IYC = filtrateIY(population[0].IY.CANS);
        let IYN = filtrateIY(population[0].IY.NEEDS);
        let speech = "I need: ";
        
        for (let j = 0 ; j < IYN.length ; j++) {
            speech += IYN[j] + " ";
        }
        speech += "- can: "
        for (let k = 0 ; k < IYC.length ; k++) {
            speech += IYC[k] + " ";
        }
        speech += "Y";
        $('#IY').empty()
        $('#IY').append(speech)
    })
    
    function filtrateIY(IY){
        let result = [];
        let keys = Object.keys(IY)
        for (let i = 0 ; i < keys.length; i++ ) {
            if (IY[keys[i]] === true){
                result.push(keys[i]);
            }
        }
        return result;
    }


    //generates the adequate number of minions in random coordinates
    function populate(num) {

        //Display.mapViz(map);
        let pop = [];
        for (let i = 0; i < num; i++) {
            pop[i] = new Minion(i, randomIntInRange(map.x), randomIntInRange(map.y), map, 1);
        }
        //Display.minionViz(pop);

        return pop;

    }

    let pixiDis = new DisplayManager(map, population);
    pixiDis.pixiDisplay(map,population);



    // let refreshDisplay = setInterval(function () {
    //     Display.mapViz(map);
    //     Display.minionViz(population);
    //
    // }, 100);


    function showTile(x, y) {

        $('#tileInfo').text()
    }


    //randomizes from 1 to maxRange
    function randomIntInRange(maxRange) {
        return Math.floor((Math.random() * maxRange) + 1);
    }




});

