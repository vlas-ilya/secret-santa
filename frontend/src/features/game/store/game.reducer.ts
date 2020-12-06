import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import fetch, { fetchAction } from 'utils/fetch';

import { GameChanges, GameId } from '../../../../../backend/src/model/GameTypes';
import { RootState } from 'store';
import { LoadingState } from '../../../../../backend/src/model/LoadingState';
import { GameVo } from '../../../model/GameVo';

export interface State {
  loadingState: LoadingState;
  game: GameVo;
}

export const initialState: State = {
  loadingState: 'INIT',
  game: new GameVo(),
};

export const game = createSlice({
  name: 'game',
  initialState,
  reducers: {
    changeLoadingState: (state: State, action: PayloadAction<LoadingState>) => {
      state.loadingState = action.payload;
    },
    changeGame: (state: State, action: PayloadAction<GameVo | GameChanges>) => {
      if ('field' in action.payload && 'value' in action.payload) {
        state.game[action.payload.field] = action.payload.value;
      } else {
        state.game = action.payload;
      }
    },
  },
});

export default game.reducer;

export const { changeLoadingState, changeGame } = game.actions;

export const loadGameInfo = (id: GameId) =>
  fetchAction(changeLoadingState, async (dispatch) => {
    const response = await fetch(`/api/game/${id}`).get();
    dispatch(changeGame(response.data));
  });

export const updateGame = () =>
  fetchAction(changeLoadingState, async (dispatch, state) => {
    const response = await fetch(`/api/game/${state.game.game.id}`).put({
      data: state.game.game,
    });
    dispatch(changeGame(response.data));
  });

export const startGame = () =>
  fetchAction(changeLoadingState, async (dispatch, state) => {
    const response = await fetch(`/api/game/${state.game.game.id}/start`).get();
    dispatch(changeGame(response.data));
  });

export const selectLoadingState = (state: RootState) => state.game.loadingState;
export const selectGame = (state: RootState) => state.game.game;
