class AIManager{
    
    constructor(pop, map)
    {
        this.pop = pop;
        this.map = map;
    }
    
    checkData()
    {
        console.log(this.pop);
        console.log(this.map);
    }
    
    start()
    {
        let AIData = this;
        let inter = setInterval(function () {
            if (AIData.pop[0].hunger > 20) {
               AIData.pop[0].eat(10);
               
               console.log(AIData.pop[0]);
            } 
        }, 1000)
    }
        
}