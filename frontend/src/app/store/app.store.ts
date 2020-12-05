import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import game from '../../features/game/store/game.reducer';
import home from '../../features/home/store/home.reducer';
import player from '../../features/player/store/player.reducer';
import registration from '../../features/registration/store/registration.reducer';

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export default configureStore({
  middleware: customizedMiddleware,
  reducer: {
    home,
    game,
    registration,
    player,
  },
});
