import Player from "@/src/logic/game/Player";
import Graph from "@/src/logic/game/Graph";
import playerLocations from "@/src/logic/game/data/PlayerLocation";
import {UnitTypeNames} from "@/src/logic/game/UnitFactory";
import graph from "@/src/logic/game/data/Graph";

interface LocationInfo {
  type: string;
  count: number;
}

interface LocationInfos {
  [location: string]: LocationInfo[];
}

class GameSystem {
  public players: Player[];
  public graph: Graph;
  public locationInfos: LocationInfos;

  constructor(players: Player[], graph: Graph) {
    this.players = players;
    this.graph = graph;
    this.locationInfos = this.getLocationInfos();
  }

  addArmyToPlayer(playerIndex: number, unitType: UnitTypeNames, number: number) {
    const location = playerLocations[playerIndex];
    this.players[playerIndex].addUnitsToLocation(unitType, location, number);
  }

  playerArmyCombat(attackerPlayerIndex: number, defenderPlayerIndex: number, attackerArmyIndex: number, defenderArmyIndex: number) {
    const attackerPlayer = this.players[attackerPlayerIndex];
    const defenderPlayer = this.players[defenderPlayerIndex];
    attackerPlayer.attack(defenderPlayer, attackerArmyIndex, defenderArmyIndex, this.graph);
  }

  movePlayerArmy(playerIndex: number, armyIndex: number, newLocation: string) {
    this.players[playerIndex].moveArmy(armyIndex, newLocation, graph);
  }

  getLocationInfos() {
    return this.players.reduce<LocationInfos>((acc, player) => {
      player.armies.forEach(army => {
        if (!acc[army.location]) {
          acc[army.location] = [];
        }
        acc[army.location].push({
          type: army.unitType as string,
          count: army.units.length
        });
      });
      return acc;
    }, {});
  }
}

export default GameSystem;