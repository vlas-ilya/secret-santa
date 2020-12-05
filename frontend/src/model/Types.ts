export type LoadingState = 'INIT' | 'LOADING' | 'SUCCESS' | 'ERROR';
export type Object = {
  [index: string]: any;
};

export type GameId = string;
export type GameState = 'INIT' | 'RUN' | 'ENDED';
export type RegistrationId = string;
export type GameName = string;
export type GameInfo = string;

export type PlayerId = string;
export type PlayerState = 'INIT' | 'ACTIVE';
export type PlayerName = string;
export type PlayerWish = string;
export type PlayerDontWish = string;