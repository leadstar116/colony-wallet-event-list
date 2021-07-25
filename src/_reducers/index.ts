import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import alertReducer from "./alert.reducer";
import eventsReducer from "./events.reducer";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: ["alertReducer", "eventsReducer"],
};

const rootReducer = combineReducers({
  alertReducer,
  eventsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer as any);

export default persistedReducer;
