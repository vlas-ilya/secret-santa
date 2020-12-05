import {  LoadingState, PlayerId } from '../../../model/Types';
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { Player, mockPlayer } from '../../../model/Player';
import fetch, { fetchAction } from '../../../utils/fetch';
import { changeGame } from '../../game/store/game.reducer';

export interface State {
  loadingState: LoadingState;
  player?: Player;
}

export const initialState: State = {
  loadingState: 'INIT',
};

export const player = createSlice({
  name: 'player',
  initialState,
  reducers: {
    changeLoadingState: (state: State, action: PayloadAction<LoadingState>) => {
      state.loadingState = action.payload;
    },
    changePlayer: (state: State, action: PayloadAction<Player | { field: string; value: any }>) => {
      if (action.payload.field) {
        state.player = state.player || mockPlayer;
        state.player[action.payload.field] = action.payload.value;
      } else {
        state.player = action.payload;
      }
    },
  },
});

export default player.reducer;

export const { changeLoadingState, changePlayer } = player.actions;

const action = fetchAction(
  () => changeLoadingState('LOADING'),
  () => changeLoadingState('SUCCESS'),
  () => changeLoadingState('ERROR'),
);

export const loadPlayerInfo = (id: PlayerId) =>
  action(async (dispatch) => {
    const response = await fetch(`/api/player/${id}`).get();
    dispatch(changePlayer(response.data));
  });

export const updatePlayer = () =>
  action(async (dispatch, state) => {
    const response = await fetch(`/api/player/${state.player.player.id}`).put({
      data: state.player.player,
    });
    dispatch(changeGame(response.data));
  });

const selectSelf = ({ player }: { player: State }) => player;

export const selectLoadingState = createSelector(selectSelf, (state) => state.loadingState);
export const selectPlayer = createSelector(selectSelf, (state) => state.player);