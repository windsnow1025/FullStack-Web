'use client';

import '../src/asset/css/index.css';

import React, {useEffect, useState} from "react";
import {
  Button,
  CssBaseline,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  ThemeProvider,
  Typography
} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import useThemeHandler from "../app/hooks/useThemeHandler";
import graph from "../src/logic/game/data/Graph";

import dynamic from 'next/dynamic';
import {unitClasses} from "../src/logic/game/data/Unit";
import initPlayers from "../src/logic/game/data/Player";
import playerLocations from "../src/logic/game/data/PlayerLocation";

const GraphComponent = dynamic(() => import('../app/components/GraphComponent'), {
  ssr: false,
});

function Game() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const title = "Game";
  useEffect(() => {
    document.title = title;
  }, []);

  const [players, setPlayers] = useState(initPlayers);
  const [armySelectedByPlayers, setArmySelectedByPlayers] = useState(players.map(() => 0));
  const [armyMoveLocationOfPlayers, setArmyMoveLocationOfPlayers] = useState(players.map(() => ""));

  const [locationInfos, setLocationInfos] = useState();
  useEffect(() => {
    const locationInfos = players.reduce((acc, player) => {
      player.armies.forEach(army => {
        if (!acc[army.location]) {
          acc[army.location] = [];
        }
        acc[army.location].push({
          type: army.unitType,
          count: army.units.length
        });
      });
      return acc;
    }, {});
    setLocationInfos(locationInfos);
  }, [players]);

  const handleAddArmy = (playerIndex, unitType, number) => {
    const newPlayers = [...players];
    const player = newPlayers[playerIndex];
    const location = playerLocations[playerIndex];
    player.addUnitsToLocation(unitType, location, number);
    setPlayers(newPlayers);
  };

  const handleCombat = (attackerPlayerIndex, defenderPlayerIndex) => {
    const attackerArmyIndex = armySelectedByPlayers[attackerPlayerIndex];
    const defenderArmyIndex = armySelectedByPlayers[defenderPlayerIndex];

    const attackerPlayer = players[attackerPlayerIndex];
    const defenderPlayer = players[defenderPlayerIndex];

    attackerPlayer.combat(defenderPlayer, attackerArmyIndex, defenderArmyIndex, graph);

    const updatedPlayers = [...players];
    setPlayers(updatedPlayers);
  };

  const handleSelectArmy = (playerIndex, armyIndex) => {
    const updatedSelectedArmies = [...armySelectedByPlayers];
    updatedSelectedArmies[playerIndex] = armyIndex;
    setArmySelectedByPlayers(updatedSelectedArmies);
  };

  const handleMoveArmy = (playerIndex, armyIndex) => {
    const newLocation = armyMoveLocationOfPlayers[playerIndex];
    if (!newLocation) {
      return;
    }

    const newPlayers = [...players];
    const player = newPlayers[playerIndex];

    player.moveArmy(armyIndex, newLocation, graph);

    setPlayers(newPlayers);
  };

  return (
    <>
      {muiTheme &&
        <ThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme/>
          <HeaderAppBar
            title={title}
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
          <div className="m-4">
            <Typography variant="h5" className="text-center">Unit Properties</Typography>
            <div className="flex-around">
              {unitClasses.map((unitClass, index) => (
                <Paper key={index} elevation={3} className="m-4 p-4 pr-32">
                  <Typography variant="h6">{unitClass.name}</Typography>
                  <Typography>Attack: {unitClass.attack}</Typography>
                  <Typography>Defense: {unitClass.defend}</Typography>
                  <Typography>Health: {unitClass.health}</Typography>
                  <Typography>Range: {unitClass.range}</Typography>
                  <Typography>Speed: {unitClass.speed}</Typography>
                  <Typography>Cost: {unitClass.cost}</Typography>
                </Paper>
              ))}
            </div>
            <GraphComponent graph={graph} attributes={locationInfos}/>
            <div className="flex-around">
              {players.map((player, playerIndex) => (
                <div key={playerIndex}>
                  <Typography variant="h6">Player {playerIndex + 1}</Typography>
                  <Typography variant="subtitle1">Money: ${player.money}</Typography>
                  {unitClasses.map((unitClass, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      sx={{m: 1}}
                      onClick={() => handleAddArmy(playerIndex, unitClass.name, 10)}
                    >
                      + 10*{unitClass.name}
                    </Button>
                  ))}
                  <RadioGroup
                    value={armySelectedByPlayers[playerIndex]}
                    onChange={(e) => handleSelectArmy(playerIndex, parseInt(e.target.value))}
                  >
                    {player.armies.map((army, armyIndex) => (
                      <FormControlLabel
                        value={armyIndex}
                        control={<Radio />}
                        label={
                          <div className="flex-around">
                            <div>
                              Army {armyIndex + 1}: {army.units.length} x {army.unitType} - {army.location}
                            </div>
                            <div className="flex-around m-2">
                              <div className="m-2">
                                <FormControl size="small">
                                  <InputLabel id={`move-select-label-${playerIndex}-${armyIndex}`}>Move To</InputLabel>
                                  <Select
                                    labelId={`move-select-label-${playerIndex}-${armyIndex}`}
                                    value={armyMoveLocationOfPlayers[playerIndex]}
                                    label="Move To"
                                    onChange={(e) => {
                                      const newMoveLocations = [...armyMoveLocationOfPlayers];
                                      newMoveLocations[playerIndex] = e.target.value;
                                      setArmyMoveLocationOfPlayers(newMoveLocations);
                                    }}
                                    sx={{ width: 120 }}
                                  >
                                    {Array.from(graph.nodes.keys())
                                      .filter(location => player.canMoveArmy(armyIndex, location, graph))
                                      .map(location => (
                                      <MenuItem key={location} value={location}>{location}</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </div>
                              <Button variant="contained" onClick={() => handleMoveArmy(playerIndex, armyIndex)} size="small">Move</Button>
                            </div>
                          </div>
                        }
                        key={armyIndex}
                      />
                    ))}
                  </RadioGroup>
                  {players.map((_, defenderPlayerIndex) => {
                    if (playerIndex !== defenderPlayerIndex) {
                      return (
                        <Button
                          key={`${playerIndex}-${defenderPlayerIndex}`}
                          variant="contained"
                          sx={{m: 1}}
                          onClick={() => handleCombat(playerIndex, defenderPlayerIndex)}
                        >
                          Attack Player {defenderPlayerIndex + 1}
                        </Button>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          </div>
        </ThemeProvider>
      }
    </>
  );
}

export default Game;