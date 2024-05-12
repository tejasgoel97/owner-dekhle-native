// src/store/actions.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RESET_USER_INFO, SET_USER_INFO } from "./actionTypes";

export const setUserInfo = (userInfo) => {
  return {
    type: SET_USER_INFO,
    payload: userInfo,
  };
};
export const clearUserInfo = () => {
  return {
    type: RESET_USER_INFO,
    payload: {},
  };
};
