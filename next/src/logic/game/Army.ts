import Unit from "@/src/logic/game/Unit";
import {createUnit, unitTypes} from "@/src/logic/game/UnitFactory";

class Army<T extends Unit> {
    public units: T[];
    public unitType: keyof typeof unitTypes;
    public unitClass: typeof Unit;
    public location: string;

    constructor(unitType: keyof typeof unitTypes, location: string) {
        this.units = [];
        this.unitType = unitType;
        this.unitClass = unitTypes[unitType];
        this.location = location;
    }

    addUnits(numbers: number) {
        for (let i = 0; i < numbers; i++) {
            this.units.push(createUnit(this.unitType) as T);
        }
    }

    removeDeadUnits() {
        this.units = this.units.filter(unit => unit.currentHealth > 0);
    }
}

export default Army;