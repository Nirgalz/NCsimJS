class TimeManager{

    
    constructor(speedFactor, map, population)
    {
        this.baseSpeed = 10;
        this.speedFactor = speedFactor;
        this.pause = false;
        this.map = map;
        this.population = population;
        this.tick = 0;
    }
    
    speedCalc()
    {
        return this.baseSpeed * this.speedFactor;
    }

    pause()
    {
        this.pause = true;
    }
    
    play()
    {
        
        let t = this;
        setTimeout(function(){
            t.tick++;
            //Starves all those minions
            for (let i = 0 ; i < t.population.length ; i++)
            {
                t.population[i].IYUpdate(t.tick);
            }
            
            //Resources renewal
            t.map.resourcesRenewal();
          


            //if not paused, makes another tick
            if (t.pause === false) {
                t.play();
            }
        }, t.speedCalc())
    }
}