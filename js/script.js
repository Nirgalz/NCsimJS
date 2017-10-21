"use strict";

$(function () {

    let map = new MapGen(12,20);
    let population = populate(0);

    console.log(population);

    $('#test').on('click', function () {
        console.log(population[0]);
    });

    function mapViz(map) {
        for (let i = 0 ; i <= map.x ; i++) {
            $('#map').append('<tr id="row-'+ i+'"></tr>');
            for (let j = 0 ; j <= map.y ; j++) {
                $('#row-'+i).append('<td id=tile-'+ i +'-'+ j +' title=>')
            }
        }

        map.landscape.forEach(function (elem) {
            $('#tile-'+elem.x +'-'+ elem.y).addClass(elem.type).attr('title', 'res'+JSON.stringify(elem.resources));
        })
    }

    mapViz(map);


    function populate(num) {
        let pop = [];
        for (let i = 0; i <= num ; i++) {
            pop[i] = new Minion(i);
        }
        return pop;
    }


});

