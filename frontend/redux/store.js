import { configureStore, combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./counter";
import userReducer from "./user";
import homeReducer from "./home";
import cartReducer from "./cart";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  counterReducer,
  userReducer,
  homeReducer,
  cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
//const userPersistedReducer = persistReducer(persistConfig, userReducer);
//const homePersistedReducer = persistReducer(persistConfig, homeReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

let persistor = persistStore(store);

/*
export default () => {
  return { store, persistor };
};*/

export { store, persistor };

/*
export const store = configureStore({
  reducer: {
    counter: persistedReducer,
  },
});
*/
