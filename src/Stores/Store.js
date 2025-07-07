import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducers/rootReducers";

// Load initial state from localStorage

export const store = configureStore({
    reducer: rootReducer
});

