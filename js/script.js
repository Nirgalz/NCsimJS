"use strict";

$(function () {

    //map and seed pop parameters
    let mapSize = [12,20];
    let seedPopParam = 10;
    

    //generates map and pop
    let map = new MapGen(mapSize);
    let population = populate(seedPopParam, mapSize);


    let AImgr = new AIManager(population,map);

    console.log(population);

    $('#test').on('click', function ()
    {
        console.log(population);
    });

    //map visualisation
    function mapViz(map) {
        for (let i = 0 ; i <= map.x ; i++)
        {
            $('#map').append('<tr id="row-'+ i+'"></tr>');
            for (let j = 0 ; j <= map.y ; j++) {
                $('#row-'+i).append('<td id=tile-'+ i +'-'+ j +' title=>')
            }
        }

        map.landscape.forEach(function (elem)
        {
            $('#tile-'+elem.x +'-'+ elem.y).addClass(elem.type).attr('title', 'res'+JSON.stringify(elem.resources));
        })
    }


    //generates the adequate number of minions in random coordinates
    function populate(num, mapSize)
    {

        mapViz(map);
        let pop = [];
        for (let i = 0; i <= num - 1 ; i++)
        {
            pop[i] = new Minion(i, randomIntInRange(map.x), randomIntInRange(map.y), map);
        }
        console.log(pop);

        for ( let k = 0 ; k<=pop.length - 1 ; k++)
        {
            let coords = '#tile-' + pop[k].xCoordinate + '-' + pop[k].yCoordinate;

            $(coords).append('.') ;
        }


    }



    //randomizes from 1 to maxRange
    function randomIntInRange(maxRange) {
            return Math.floor((Math.random() * maxRange) + 1);
    }


});

