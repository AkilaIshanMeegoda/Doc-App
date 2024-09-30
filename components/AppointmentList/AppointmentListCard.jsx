import React from "react";
import { View, Text } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons"; // Importing icons
import { Image } from "react-native";

const AppointmentListCard = ({ appointment }) => {
  return (
    <View className="flex-row items-center justify-between p-4 mt-4 mb-4 bg-white border-l-4 border-blue-500 rounded-lg shadow-lg">
      <Image
        source={{ uri: appointment.doctorImage }}
        className="w-24 h-24 mr-2 rounded-full"
      />
      <View>
        {/* Patient Name */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="person-circle-outline" size={20} color="#5a67d8" />
          <Text className="pr-8 ml-2 text-xl font-bold text-gray-800">
            {appointment.patientName}
          </Text>
        </View>

        {/* Phone Number */}
        <View className="flex-row items-center mb-2">
          <FontAwesome name="phone" size={20} color="green" />
          <Text className="ml-3 text-gray-600 text-md">
            {appointment.patientMobile}
          </Text>
        </View>

        {/* Doctor Info */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="medkit-outline" size={20} color="blue" />
          <Text className="pr-8 ml-2 text-gray-600">
            {appointment.doctorName} - {appointment.doctorSpecialization}
          </Text>
        </View>

        {/* Appointment Date */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={20} color="black" />
          <Text className="ml-2 text-gray-600">
            {appointment.appointmentDate}
          </Text>
        </View>

        {/* Appointment Time */}
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={20} color="red" />
          <Text className="ml-2 text-gray-600">
            {appointment.appointmentTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AppointmentListCard;
