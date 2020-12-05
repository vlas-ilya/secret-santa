import { GameId, GameInfo, GameName, GameState, RegistrationId, Object } from './Types';
import { Player } from './Player';

export interface Game extends Object {
  id?: GameId;
  gameState?: GameState;
  registrationId?: RegistrationId;
  name?: GameName;
  info?: GameInfo;
  player?: Player;
  players?: Player[];
}

export const mockGame: Game = {

}