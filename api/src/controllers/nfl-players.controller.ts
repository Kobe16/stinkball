import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { NFLPlayerService } from '@/services/nfl-players.service';
import { NFLPlayer } from '@/interfaces/nfl-players.interface';
import { NFLPlayerDTO } from '@/dtos/nfl-players.dto';
const fetch = require('node-fetch');


export class NFLPlayerController {
  public nflPlayer = Container.get(NFLPlayerService);

  public getNFLPlayers = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const findAllNFLPlayersData: NFLPlayer[] = await this.nflPlayer.findAllNFLPlayers();

      res.status(200).json({ data: findAllNFLPlayersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getNFLPlayerById = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const nflPlayerId = Number(req.params.id);
      const findOneNFLPlayerData: NFLPlayer = await this.nflPlayer.findNFLPlayerById(nflPlayerId);

      res.status(200).json({ data: findOneNFLPlayerData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  // This method only gets the players with a projection that way we dont have 3000 players in our DB just the relavant ones.
  public postNFLPlayers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let nflPlayers: NFLPlayer[] = [];

    // URL to GET NFL Players externally.
    const url = 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLProjections?week=12&twoPointConversions=2&passYards=.04&passAttempts=-.5&passTD=4&passCompletions=1&passInterceptions=-2&pointsPerReception=1&carries=.2&rushYards=.1&rushTD=6&fumbles=-2&receivingYards=.1&receivingTD=6&targets=.1';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'ca7f9abf22msh2ffe3e4ebe6d5d5p14d858jsn9109ea285446',
        'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
      }
    };

    try {
      // Get NFL Players externally.
      const response = await fetch(url, options);
      const result = await response.json();

      // Iterate over each element in the external result adding each Player to DB.
      try {
        for (const element of result.body) {
          let newNFLPlayer: NFLPlayerDTO = {
            player_name: element.player_name,
            teamId: element.teamId,
            position: element.position,
            player_portrait: element.player_portrait,
          }
          // Create Player and add to response array.
          let addNewNFLPlayer: NFLPlayer = await this.nflPlayer.createNFLPlayer(newNFLPlayer);
          if (addNewNFLPlayer) nflPlayers.push(addNewNFLPlayer);
        }
        res.status(200).json({ data: nflPlayers, message: 'seedNFLPlayers' });
      } catch (error) {
        next(error)
      }
    } catch (error) {
      console.error(error);
    }
  };
}