import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";

export default class Podesavanja extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <StatusBar style="dark" />
        <TouchableOpacity onPress={() => this.props.navigation.navigate('OAplikaciji')}>
          <Text style={{marginBottom: 50}}>O Aplikaciji</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={() => this.props.navigation.reset({ index: 0, routes: [{name: 'Login'}] })}>
          <Text style={{color: 'white'}}>ODJAVI SE</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  logoutButton:{
    backgroundColor: '#c9093d',
    borderRadius: 100,
    paddingTop: 15,
    paddingBottom: 15,
    paddingStart: 20,
    paddingEnd: 20,
  }
});
