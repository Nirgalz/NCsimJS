$(function () {

    let map = new MapGen(5,8);

    function mapViz(map) {
        for (let i = 0 ; i <= map.x ; i++) {
            $('#map').append('<tr id="row-'+ i+'"></tr>');
            for (let j = 0 ; j <= map.y ; j++) {
                $('#row-'+i).append('<td id=tile-'+ i + j +'></td>')
            }
        }

        map.landscape.forEach(function (elem) {
            $('#tile-'+elem.x + elem.y).addClass(elem.type);
        })
    }

    mapViz(map);


    console.log(map);

});

