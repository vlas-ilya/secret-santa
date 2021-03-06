import { PlayerId, PlayerPassword } from '../../model/PlayerTypes';

import { ChangePlayerPasswordMessage } from '../../model/ChangePlayerPasswordMessage';
import { GameStorage } from '../game/game.storage';
import IncorrectPasswordException from '../../exceptions/incorrect-password.exception';
import { Injectable } from '@nestjs/common';
import InvalidStateException from '../../exceptions/invalid-state.exception';
import NotFoundException from '../../exceptions/not-found.exception';
import PlayerEntity from '../../model/PlayerEntity';
import { PlayerStorage } from './player.storage';
import { RegistrationId } from '../../model/GameTypes';
import { throwIfTrue } from '../../utils/thorw-if-true';
import GameEntity from '../../model/GameEntity';

@Injectable()
export class PlayerService {
  constructor(private readonly storage: PlayerStorage, private readonly gameStorage: GameStorage) {}

  private static checkPassword(player: PlayerEntity, password: PlayerPassword): void {
    throwIfTrue(
      player.password != null && player.password != password,
      new IncorrectPasswordException('INCORRECT_PLAYER_PASSWORD'),
    );
  }

  async create(registrationId: RegistrationId): Promise<PlayerId> {
    const game = await this.gameStorage.findByRegistrationId(registrationId);
    throwIfTrue(!game, new NotFoundException('GAME_NOT_FOUND'));
    throwIfTrue(game.gameState !== 'INIT', new InvalidStateException('INVALID_GAME_STATE'));

    const player = await this.storage.create(registrationId);
    return player.id;
  }

  async get(id: PlayerId, password: PlayerPassword): Promise<PlayerEntity> {
    const player = await this.storage.find(id);
    throwIfTrue(!player, new NotFoundException('PLAYER_NOT_FOUND'));
    PlayerService.checkPassword(player, password);
    return player;
  }

  async getGameInfo(id: PlayerId, password: PlayerPassword): Promise<GameEntity> {
    const player = await this.storage.find(id);
    throwIfTrue(!player, new NotFoundException('PLAYER_NOT_FOUND'));
    PlayerService.checkPassword(player, password);

    const persisted = await this.gameStorage.findByPlayerId(id);
    throwIfTrue(!persisted, new NotFoundException('GAME_NOT_FOUND'));

    const game = new GameEntity();
    game.title = persisted.title;
    game.description = persisted.description;
    game.gameState = persisted.gameState;

    return game;
  }

  async update(player: PlayerEntity, password: PlayerPassword): Promise<PlayerEntity> {
    const game = await this.gameStorage.findByPlayerId(player.id);
    const persisted = await this.storage.find(player.id);
    throwIfTrue(!player, new NotFoundException('PLAYER_NOT_FOUND'));
    PlayerService.checkPassword(player, password);
    throwIfTrue(!game, new NotFoundException('GAME_NOT_FOUND'));
    throwIfTrue(game.gameState !== 'INIT', new InvalidStateException('INVALID_GAME_STATE'));

    return await this.storage.update({
      ...persisted,
      playerState: 'ACTIVE',
      name: player.name,
      wish: player.wish,
      taboo: player.taboo,
    });
  }

  async changePassword(
    id: PlayerId,
    changePasswordMessage: ChangePlayerPasswordMessage,
  ): Promise<PlayerEntity> {
    const persisted = await this.storage.find(id);
    throwIfTrue(!persisted, new NotFoundException('PLAYER_NOT_FOUND'));
    PlayerService.checkPassword(persisted, changePasswordMessage.oldPassword);

    persisted.password = changePasswordMessage.newPassword;
    persisted.hasPassword = true;
    return await this.storage.update(persisted);
  }
}
