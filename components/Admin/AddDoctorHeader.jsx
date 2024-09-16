import { View, Text } from 'react-native'
import React from 'react'
import { Feather } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

const AddDoctorHeader = () => {
  return (
    <View>
       <View className="flex-row h-24 bg-white">
        <Text className="ml-6 mt-14 text-xl text-center font-[poppins-medium]">
          <Feather
            className="pl-8 mt-12 "
            name="plus-square"
            size={24}
            color={Colors.PRIMARY}
          />
          <Text className="ml-8 "> </Text>
          Add New Doctor
        </Text>
      </View>
    </View>
  )
}

export default AddDoctorHeader