class Build {

    constructor(map, pop) {
        this.map = map;
        this.pop = pop;
    }

    construction(constructionType, tile, minionIndex, startTick) {
        let cost = 0;
        let resType = "";
        let timeToBuild = 0;
        let minionsToBuild = 0;

        switch (constructionType) {
            case "campFire":
                cost = 100;
                resType = "wood";
                timeToBuild = 10;
                minionsToBuild = 1;
                this.map.landscape[tile].modifiers.eat = 5;

                break;
            case "potatoField":
                cost = 100;
                resType = "wood";
                timeToBuild = 10;
                minionsToBuild = 2;
                break;
            case "fishingPole":
                cost = 50;
                resType = "wood";
                timeToBuild = 5;
                minionsToBuild = 1;
                this.pop[minionIndex].inventory.fishingPole = 1;
                break;
            case "shelter":
                cost = 100;
                resType = "wood";
                timeToBuild = 20;
                minionsToBuild = 2;
                this.map.landscape[tile].modifiers.sleep = 5;
                break;

        }

        if (constructionType !== "fishingPole") {
            this.map.landscape[tile].type = constructionType;
        }


        this.pop[minionIndex].statusM = "building " + constructionType + "";
        this.pop[minionIndex].wakeTick = startTick + timeToBuild;
        this.pop[minionIndex].inventory[resType] -= cost;
    }


    granary() {
        let cost = [500, 'wood'];
        let timeToBuild = 50;
        let minionsToBuild = 2;
        //todo: stocks 1000 food
    }

    woodPile() {
        let cost = [100, 'wood'];
        let timeToBuild = 50;
        let minionsToBuild = 2;
        //todo: stocks 1000 wood
    }

}