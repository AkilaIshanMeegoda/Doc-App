import { View, Text, Image, TextInput, StyleSheet } from "react-native";
import React from "react";
import RNPickerSelect from "react-native-picker-select";

import AddDoctorHeader from "../../components/Admin/AddDoctorHeader";

const addDoctor = () => {
  return (
    <View>
      <AddDoctorHeader />
      <View className="p-6">
        <Text className="font-[poppins-bold] text-lg">Add new doctor</Text>
        <Text className="font-[poppins-medium] text-lg text-gray-500 mt-[-6px]">
          Fill all details about doctor
        </Text>

        <View className="flex-row">
          <Image
            className="w-20 h-20 mt-4"
            source={require("../../assets/images/photo.png")}
          />
          <Text className="font-[poppins-medium] text-lg mt-10 ml-8">
            Add new doctor
          </Text>
        </View>

        <View>
          <TextInput
            placeholder="Enter full name"
            className="p-2 px-4 mt-2 text-lg bg-white border-2 border-gray-200 rounded-md "
          />
           <TextInput
            placeholder="Enter years of experience"
            keyboardType="numeric"
            className="p-2 px-4 mt-2 text-lg bg-white border-2 border-gray-200 rounded-md "
          />
          <View className="mt-2 text-black bg-white border-2 border-gray-200 rounded-md text-md ">
            <RNPickerSelect
              className="font-[poppins-bold]"
              onValueChange={(value) => console.log(value)}
              placeholder={{
                label: "Select Specialization",
                value: null,
              }}
              items={[
                { label: "Cardiologist", value: "Cardiologist" },
                { label: "Dermatologist", value: "Dermatologist" },
                { label: "Endocrinologist", value: "Endocrinologist" },
                { label: "Gastroenterologist", value: "Gastroenterologist" },
                { label: "Oncologist", value: "Oncologist" },
                { label: "Pulmonologist", value: "Pulmonologist" },
                { label: "Nephrologist", value: "Nephrologist" },
                { label: "Otolaryngologist ", value: "Otolaryngologist" },
              ]}
            />
          </View>
          <View className="mt-2 text-black bg-white border-2 border-gray-200 rounded-md text-md " style={styles.container}>
            <RNPickerSelect
              className="font-[poppins-bold]"
              style={styles.sourcePicker}
              onValueChange={(value) => console.log(value)}
              placeholder={{
                label: "Select Hospital",
                value: null,
              }}
              itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily:"poppins", fontSize:17 }}
              items={[
                { label: "Nawaloka Hospital", value: "Nawaloka Hospital" },
                { label: "Asiri Central Hospital", value: "Asiri Central Hospital" },
                { label: "Hemas Hospital", value: "Hemas Hospital" },
                { label: "Ninewells Hospital", value: "Ninewells Hospital" },
                { label: "Durdans Hospital", value: "Durdans Hospital" },
                { label: "Lanka Hospitals", value: "Lanka Hospitals" },
                { label: "Golden Key Hospital", value: "Golden Key Hospital" },
              ]}
            />
          </View>
          <TextInput
            placeholder="Description"
            numberOfLines={3}
            className="p-2 px-4 mt-2 text-lg bg-white border-2 border-gray-200 rounded-md "
          />
         
        </View>
      </View>
    </View>
  );
};

export default addDoctor;

const styles = StyleSheet.create({
  container : {
      fontFamily:"poppins-bold",
      fontSize:"10px"
  },
});
