import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from './loaderSlice.ts';

export const store = configureStore({
    reducer : {
        loader : loaderReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;