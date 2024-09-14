import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const TabLayout = () => {
  return( 
  <Tabs>
    <Tabs.Screen name='home'/>
    <Tabs.Screen name='patientPortal'/>
    <Tabs.Screen name='emergency'/>
    <Tabs.Screen name='remind'/>
    <Tabs.Screen name='profile'/>
  </Tabs>);
};

export default TabLayout;
