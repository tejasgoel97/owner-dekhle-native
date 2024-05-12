// src/components/AuthNavigator.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import CreateQRScreen from "../screens/CreateQRScreen";
import TempIDScreen from "../screens/TempIDScreen";
import TempIDListScreen from "../screens/TempIDListScreen";
import MyAgentsScreen from "../screens/MyAgentsScreen";
import MyPointsScreen from "../screens/MyPointsScreen";
import AgentDetailsScreen from "../screens/AgentDetailsScreen";
import { setUserInfo } from "../store/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const userInfo = useSelector((state) => state.userInfo); // Adjust according to your state structure
  const dispatch = useDispatch();
  const isAuthenticated = userInfo && userInfo.id; // Check if the user is considered authenticated
  useEffect(() => {
    loadUserInfo();
  }, []);
  const loadUserInfo = async () => {
    try {
      const serializedState = await AsyncStorage.getItem("user-info");

      if (serializedState === null) {
        return undefined; // No state in AsyncStorage
      }
      const userInfoData = JSON.parse(serializedState);
      console.log("async", userInfoData);
      if (
        !userInfoData.token ||
        !userInfoData.name ||
        !userInfoData.phoneNumber ||
        !userInfoData.dealerPhoneNumber ||
        !userInfoData.dealerId
      ) {
        console.log("Not Valid Data ...returning to orignal Login");
        console.log({
          token: userInfoData.token,
          name: userInfoData.name,
          phoneNumber: userInfoData.phoneNumber,
          dealerName: userInfoData.dealerName,
          dealerId: userInfoData.dealerId,
        });
        return;
      }
      dispatch(setUserInfo(userInfoData));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        // {true ? (
        <>
          {/* Screens available only when user is authenticated */}
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="CreateQRScreen" component={CreateQRScreen} />
          <Stack.Screen name="TempIDScreen" component={TempIDScreen} />
          <Stack.Screen name="TempIDListScreen" component={TempIDListScreen} />
          <Stack.Screen name="MyAgentsScreen" component={MyAgentsScreen} />
          <Stack.Screen name="MyPointsScreen" component={MyPointsScreen} />
          <Stack.Screen
            name="AgentDetailsScreen"
            component={AgentDetailsScreen}
          />
        </>
      ) : (
        <>
          {/* Screens available when user is not authenticated */}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
