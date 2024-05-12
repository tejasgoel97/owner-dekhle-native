// src/store/store.js
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { userInfoReducer } from "./reducers";

const rootReducer = combineReducers({
  userInfo: userInfoReducer,
});
console.log(thunk);
const store = createStore(rootReducer);

export default store;
