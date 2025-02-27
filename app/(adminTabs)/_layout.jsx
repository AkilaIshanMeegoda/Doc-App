import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Tabs, useNavigation } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../constants/Colors";
import { LogBox } from "react-native";

const AdminTabLayout = () => {
  LogBox.ignoreAllLogs()
  const navigation = useNavigation();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.PRIMARY,
      }}
    >
      <Tabs.Screen
        name="adminHome"
        options={{
          headerTitle: "All Appointments",
          headerTitleStyle: {
            fontFamily: "poppins-medium",
            fontSize: 20,
          },
          tabBarLabel: "Home",
          tabBarIcon: () => (
            <Feather name="home" size={24} color={Colors.PRIMARY} />
          ),
          headerLeft: () => (
              <Feather
                name="grid"
                size={24}
                color={Colors.PRIMARY}
                style={{ marginLeft: 15, marginBottom: 4 }}
              />
          ),
        }}
      />
      <Tabs.Screen
        name="manageDoctors"
        options={{
          tabBarLabel: "Manage Doctor",
          headerShown: false,
          tabBarIcon: () => (
            <Feather name="file-text" size={24} color={Colors.PRIMARY} />
          ),
        }}
      />

      <Tabs.Screen
        name="addDoctor"
        options={{
          tabBarLabel: "Add Doctor",
          headerShown: false,
          tabBarIcon: () => (
            <Feather name="plus-square" size={24} color={Colors.PRIMARY} />
          ),
        }}
      />

      <Tabs.Screen
        name="adminProfile"
        options={{
          headerTitle: "Logout",
          headerTitleStyle: {
            fontFamily: "poppins-medium",
            fontSize: 20,
          },
          tabBarLabel: "Profile",
          tabBarIcon: () => (
            <Feather name="user" size={24} color={Colors.PRIMARY} />
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather
                name="arrow-left"
                size={24}
                color={Colors.PRIMARY}
                style={{ marginLeft: 15, marginBottom: 4 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
};

export default AdminTabLayout;
