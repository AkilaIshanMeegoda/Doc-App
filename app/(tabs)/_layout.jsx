import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Tabs, useNavigation } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const TabLayout = () => {
  const navigation = useNavigation();
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather
                name="arrow-left"
                size={24}
                color={Colors.PRIMARY}
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="emergency"
        options={{
          headerTitle: "Emergency",
          tabBarLabel: "Emergency",
          headerTitleStyle: {
            fontFamily: "poppins-medium",
            fontSize: 20,
          },
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="car-emergency"
              size={24}
              color={Colors.PRIMARY}
            />
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
      <Tabs.Screen
        name="remind"
        options={{
          headerTitleStyle: {
            fontFamily: "poppins-medium",
          },
          tabBarLabel: "Remind",
          headerShown: false,
          tabBarIcon: () => (
            <Feather name="bell" size={24} color={Colors.PRIMARY} />
          ),
          headerTitle: "Medication Reminder",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather
                name="arrow-left"
                size={24}
                color={Colors.PRIMARY}
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Edit Profile",
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

export default TabLayout;
