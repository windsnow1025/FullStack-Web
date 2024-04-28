import Army from "@/src/logic/game/Army";
import Unit from "@/src/logic/game/Unit";
import Infantry from "@/src/logic/game/Units/Infantry";
import Archer from "@/src/logic/game/Units/Archer";
import Graph from "@/src/logic/game/Graph";
import {armyCombat} from "@/src/logic/game/Combat";

const unitTypes = {
    Infantry: Infantry,
    Archer: Archer
};

class Player {
    public armies: Army<Unit>[];
    public money: number;

    constructor() {
        this.armies = [];
        this.money = 100;
    }

    addArmy(unitType: keyof typeof unitTypes, location: string) {
        const UnitClass = unitTypes[unitType];
        const unitFactory = () => new UnitClass();

        const army = new Army<Unit>(unitFactory, location);
        this.armies.push(army);
    }

    addUnitsToArmy(armyIndex: number, numbers: number) {
        const army = this.armies[armyIndex];
        army.addUnits(numbers);
        this.money -= army.units[0].cost * numbers;
    }

    combat(defenderPlayer: Player, attackerArmyIndex: number, defenderArmyIndex: number, graph: Graph) {
        const attackerArmy = this.armies[attackerArmyIndex];
        const defenderArmy = defenderPlayer.armies[defenderArmyIndex];

        if (!attackerArmy || !defenderArmy) {
            return;
        }

        armyCombat(attackerArmy, defenderArmy, graph.getDistance(attackerArmy.location, defenderArmy.location));

        this.removeEmptyArmies();
        defenderPlayer.removeEmptyArmies();
    }

    removeEmptyArmies() {
        this.armies = this.armies.filter(army => army.units.length > 0);
    }
}

export default Player;