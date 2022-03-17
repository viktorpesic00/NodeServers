import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./components/Login";
import Pocetna from "./components/Pocetna";
import OAplikaciji from "./components/OAplikaciji";
import Obavestenja from "./components/Obavestenja";
import Popusti from "./components/Popusti";
import Isum from "./components/Isum";
import Lams from "./components/Lams";
import Zimbra from "./components/Zimbra";
import Podesavanja from "./components/Podesavanja";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pocetna"
          component={Pocetna}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Obavestenja"
          component={Obavestenja}
          options={{ headerShown: true, headerBackTitle: "Nazad" }}
        />
        <Stack.Screen
          name="Popusti"
          component={Popusti}
          options={{ headerShown: true, headerBackTitle: "Nazad" }}
        />
        <Stack.Screen
          name="Isum"
          component={Isum}
          options={{
            headerShown: true,
            title: "ISUM",
            headerBackTitle: "Nazad",
          }}
        />
        <Stack.Screen
          name="Lams"
          component={Lams}
          options={{
            headerShown: true,
            title: "LAMS",
            headerBackTitle: "Nazad",
          }}
        />
        <Stack.Screen
          name="Zimbra"
          component={Zimbra}
          options={{ headerShown: true, headerBackTitle: "Nazad" }}
        />
        <Stack.Screen
          name="Podesavanja"
          component={Podesavanja}
          options={{ headerShown: true, headerBackTitle: "Nazad" }}
        />
        
        <Stack.Screen
          name="OAplikaciji"
          component={OAplikaciji}
          options={{
            headerShown: true,
            title: "O Aplikaciji",
            headerBackTitle: "Nazad",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
