import { GameId, GamePassword } from '../../model/GameTypes';

import { ChangeGamePasswordMessage } from '../../model/ChangeGamePasswordMessage';
import GameEntity from '../../model/GameEntity';
import { GameStorage } from './game.storage';
import IncorrectPasswordException from '../../exceptions/incorrect-password.exception';
import { Injectable } from '@nestjs/common';
import InvalidStateException from '../../exceptions/invalid-state.exception';
import NotFoundException from '../../exceptions/not-found.exception';
import { PlayerStorage } from '../player/player.storage';
import { setPlayersTarget } from '../../utils/calculate-target';
import { throwIfTrue } from '../../utils/thorw-if-true';

@Injectable()
export class GameService {
  constructor(
    private readonly storage: GameStorage,
    private readonly playerStorage: PlayerStorage,
  ) {}

  private static checkPassword(game: GameEntity, password: GamePassword): void {
    throwIfTrue(
      game.password != null && game.password != password,
      new IncorrectPasswordException('INCORRECT_GAME_PASSWORD'),
    );
  }

  async create(): Promise<GameId> {
    const game = await this.storage.create();
    return game.id;
  }

  async get(id: GameId, password: GamePassword): Promise<GameEntity> {
    const game = await this.storage.find(id);
    throwIfTrue(!game, new NotFoundException('GAME_NOT_FOUND'));
    GameService.checkPassword(game, password);
    return game;
  }

  async start(id: GameId, password: GamePassword): Promise<void> {
    const persisted: GameEntity = await this.storage.find(id);
    throwIfTrue(!persisted, new NotFoundException('GAME_NOT_FOUND'));
    throwIfTrue(persisted.gameState !== 'INIT', new InvalidStateException('INVALID_GAME_STATE'));
    GameService.checkPassword(persisted, password);

    setPlayersTarget(persisted.players.filter((player) => player.playerState === 'ACTIVE'));

    for (const player of persisted.players) {
      await this.playerStorage.update(player);
    }

    await this.storage.update({
      ...persisted,
      gameState: 'RUN',
    });
  }

  async update(game: GameEntity, password: GamePassword): Promise<GameEntity> {
    const persisted = await this.storage.find(game.id);
    throwIfTrue(!persisted, new NotFoundException('GAME_NOT_FOUND'));
    throwIfTrue(persisted.gameState !== 'INIT', new InvalidStateException('INVALID_GAME_STATE'));
    GameService.checkPassword(persisted, password);

    persisted.title = game.title;
    persisted.description = game.description;
    return this.storage.update(persisted);
  }

  async delete(id: GameId, password: GamePassword): Promise<void> {
    const persisted = await this.storage.find(id);
    throwIfTrue(!persisted, new NotFoundException('GAME_NOT_FOUND'));
    GameService.checkPassword(persisted, password);

    for (const player of persisted.players) {
      await this.playerStorage.delete(player);
    }

    await this.storage.delete(persisted);
  }

  async changePassword(
    id: GameId,
    changePasswordMessage: ChangeGamePasswordMessage,
  ): Promise<GameEntity> {
    const persisted = await this.storage.find(id);
    throwIfTrue(!persisted, new NotFoundException('GAME_NOT_FOUND'));
    GameService.checkPassword(persisted, changePasswordMessage.oldPassword);

    persisted.password = changePasswordMessage.newPassword;
    persisted.hasPassword = true;
    return await this.storage.update(persisted);
  }
}
