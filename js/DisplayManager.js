class DisplayManager
{
    //map visualisation
    mapViz(map) {
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
    
    minionViz(pop) {
        for ( let k = 0 ; k<=pop.length - 1 ; k++)
        {
            let coords = '#tile-' + pop[k].xCoordinate + '-' + pop[k].yCoordinate;

            $(coords).append('<span id=minion-'+(k +1) +'>0</span>') ;
        }
    }
    
    
    
}