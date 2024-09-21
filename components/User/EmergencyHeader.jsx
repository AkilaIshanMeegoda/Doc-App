import { View, Text } from "react-native";
import React from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from "../../constants/Colors";

const EmergencyHeader = () => {
  return (
    <View>
      <View className="flex-row h-24 bg-white">
        <Text className="ml-6 mt-14 text-xl text-center font-[poppins-medium]">
        <MaterialCommunityIcons name="car-emergency" size={24} color={Colors.PRIMARY} />
          <Text className="ml-8 "> </Text>
          Emergency
        </Text>
      </View>
    </View>
  );
};

export default EmergencyHeader;
