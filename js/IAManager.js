class AIManager{
    
    start(pop, map){
        let inter = setInterval(function () {
            if (pop[0].hunger > 20) {
               pop[0].eat(10);
               console.log(pop[0]);
            } 
        }, 1000)
    }
        
}