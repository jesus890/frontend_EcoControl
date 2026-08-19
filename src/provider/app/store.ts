import { configureStore } from '@reduxjs/toolkit'
import catalogoReducer from '../Slice/CatalogoSlice.ts';

export const store = configureStore({
  reducer: {
    CatalogoSeleccionados: catalogoReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
