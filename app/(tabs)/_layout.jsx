import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import {Colors} from "../../constants/Colors"

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => (
            <Feather name="home" size={24} color={Colors.PRIMARY} />
          ),
        }}
      />
      <Tabs.Screen
        name="patientPortal"
        options={{
          tabBarLabel: "Patient Portal",
          tabBarIcon: () => (
            <Feather name="grid" size={24} color={Colors.PRIMARY} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          tabBarLabel: "Emergency",
          tabBarIcon: () => (
            <Feather name="headphones" size={24} color={Colors.PRIMARY} />
          ),
        }}
      />
      <Tabs.Screen
        name="remind"
        options={{
          tabBarLabel: "Remind",
          tabBarIcon: () => (
            <Feather name="bell" size={24} color={Colors.PRIMARY} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => (
            <Feather name="user" size={24} color={Colors.PRIMARY} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
