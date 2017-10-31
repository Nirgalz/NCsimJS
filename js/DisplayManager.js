class DisplayManager
{
    //map visualisation
    mapViz(map) {
        $('#map').empty();
        for (let i = 0 ; i <= map.x ; i++)
        {
            $('#map').append('<tr id="row-'+ i+'"></tr>');
            for (let j = 0 ; j <= map.y ; j++) {
                $('#row-'+i).append('<td onclick="showTile('+i+','+j+')" id=tile-'+ i +'-'+ j +' ></td>')
            }
        }

        map.landscape.forEach(function (elem)
        {
            $('#tile-'+elem.x +'-'+ elem.y).addClass(elem.type).append('<progress value="' + elem.resources.food + '" max="100"></progress>');
        })
    }
    
    minionViz(pop) {
        $('#minionInfo').empty();
        for ( let k = 0 ; k<=pop.length - 1 ; k++)
        {
            let coords = '#tile-' + pop[k].xCoordinate + '-' + pop[k].yCoordinate;
            if (pop[k].isAlive === true)
            {
               
               $(coords).append('<img src="media/face-3-1.png" id=minion-'+(k +1) +'>') ;
               // $(coords).append('<i class="fa fa-user-circle" aria-hidden="true" id=minion-'+(k +1) +'></i>') ;
            }
            else if (pop[k].isAlive === false)
            {
                $(coords).append('<img src="media/face-3-4.png" id=minion-'+(k +1) +'>') ;
                //$(coords).append('<i class="fa fa-plus-square" aria-hidden="true" id=minion-'+(k +1) +'></i>') ;
            }

            $('#minionInfo').append('<tr><td>'+pop[k].id+'</td><td>'+pop[k].status+'</td><td>'+Math.floor(pop[k].health)+'</td><td>'+Math.floor(pop[k].hunger)+'</td><td>'+pop[k].inventory.food+'</td>')
        }
    }
    
    
    
}