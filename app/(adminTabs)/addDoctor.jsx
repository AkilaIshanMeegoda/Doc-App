import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";

import AddDoctorHeader from "../../components/Admin/AddDoctorHeader";

const K_OPTIONS = [
  { item: "Juventus", id: "JUVE" },
  { item: "Real Madrid", id: "RM" },
  { item: "Barcelona", id: "BR" },
  { item: "PSG", id: "PSG" },
  { item: "FC Bayern Munich", id: "FBM" },
  { item: "Manchester United FC", id: "MUN" },
  { item: "Manchester City FC", id: "MCI" },
  { item: "Everton FC", id: "EVE" },
  { item: "Tottenham Hotspur FC", id: "TOT" },
  { item: "Chelsea FC", id: "CHE" },
  { item: "Liverpool FC", id: "LIV" },
  { item: "Arsenal FC", id: "ARS" },
  { item: "Leicester City FC", id: "LEI" },
];

const AddDoctor = () => {
  const [selectedTeam, setSelectedTeam] = useState({});
  const [selectedTeams, setSelectedTeams] = useState([]);

  // Move these functions inside the component
  const onChange = (val) => {
    setSelectedTeam(val);
  };

  const onMultiChange = (item) => {
    setSelectedTeams(xorBy(selectedTeams, [item], "id"));
  };

  return (
    <ScrollView>
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
          <View className="mt-2 text-black bg-white border-2 border-gray-200 rounded-md text-md">
            <RNPickerSelect
              className="font-[poppins-bold]"
              onValueChange={(value) => console.log(value)}
              placeholder={{ label: "Select Specialization", value: null }}
              items={[
                { label: "Cardiologist", value: "Cardiologist" },
                { label: "Dermatologist", value: "Dermatologist" },
                { label: "Endocrinologist", value: "Endocrinologist" },
                { label: "Gastroenterologist", value: "Gastroenterologist" },
                { label: "Oncologist", value: "Oncologist" },
                { label: "Pulmonologist", value: "Pulmonologist" },
                { label: "Nephrologist", value: "Nephrologist" },
                { label: "Otolaryngologist", value: "Otolaryngologist" },
              ]}
            />
          </View>
          <View className="mt-2 text-black bg-white border-2 border-gray-200 rounded-md text-md">
            <RNPickerSelect
              className="font-[poppins-bold]"
              onValueChange={(value) => console.log(value)}
              placeholder={{ label: "Select Hospital", value: null }}
              items={[
                { label: "Nawaloka Hospital", value: "Nawaloka Hospital" },
                {
                  label: "Asiri Central Hospital",
                  value: "Asiri Central Hospital",
                },
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

            <View className="mx-4 mt-4 ">
            <Text style={{ fontSize: 20, paddingBottom: 10 }}>
              Select times
            </Text>
            <SelectBox
              label="Select multiple"
              options={K_OPTIONS}
              selectedValues={selectedTeams}
              onMultiSelect={onMultiChange} // Corrected here
              onTapClose={onMultiChange} // Corrected here
              isMulti
            />
            </View>
          </View>
      </View>
    </ScrollView>
  );
};

export default AddDoctor;
