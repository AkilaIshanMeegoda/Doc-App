import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../constants/Colors";

const AdminTabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
      }}
    >
      <Tabs.Screen
        name="manageDoctors"
        options={{
          tabBarLabel: "Manage Doctor",
          tabBarIcon: () => (
            <Feather name="file-text" size={24} color={Colors.PRIMARY} />
          ),
        }}
      />
      <Tabs.Screen
        name="adminHome"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => (
            <Feather name="home" size={24} color={Colors.PRIMARY} />
          ),
        }}
      />

      <Tabs.Screen
        name="addDoctor"
        options={{
          tabBarLabel: "Add Doctor",
          tabBarIcon: () => (
            <Feather name="plus-square" size={24} color={Colors.PRIMARY} />
          ),
        }}
      />

      <Tabs.Screen
        name="adminProfile"
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

export default AdminTabLayout;
