import { useDispatch, useSelector } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';

import { gameReducer } from './gameSlice';

export const store = configureStore({
    reducer: gameReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
