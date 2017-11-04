class TimeManager{

    
    constructor(speedFactor, map, population, AI)
    {
        this.baseSpeed = 10;
        this.speedFactor = speedFactor;
        this.pause = false;
        this.map = map;
        this.population = population;
        this.AI = AI;
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
                t.population[i].starve();
                t.population[i].fatigueGen();
                if (t.population[i].fatigue === 100){
                    t.population[i].sleep(t.tick);
                }
            }
            
            //Resources renewal
            t.map.resourcesRenewal();
          
        
            //AI tick
            t.AI.start(t.tick);
            
            //if not paused, makes another tick
            if (t.pause === false) {
                t.play();
            }
        }, t.speedCalc())
    }
}