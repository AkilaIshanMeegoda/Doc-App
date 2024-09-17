import { View, Text, Image, FlatList, ScrollView, TouchableOpacity, LogBox } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";

const Doctor = () => {
  const {doctorId} = useLocalSearchParams()
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    getDoctorById();
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  }, [])

  const getDoctorById = async () => {
    const docRef = doc(db, "DoctorList", doctorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDoctor({ id: docSnap.id, ...docSnap.data() });
    } else {
      console.log("No such document");
    }
  };

  const renderAppointmentItem = ({ item }) => (
    <View className="flex-row justify-between my-1">
      <Text className="font-[poppins-medium] text-[14px] w-20">
        {item.day}{" "}
      </Text>
      <FlatList
        data={item.times}
        horizontal
        keyExtractor={(time, index) => index.toString()}
        renderItem={({ item: time }) => (
          <Text className="text-white font-[poppins-medium] text-[14px] border border-blue-400 px-2 bg-[#607AFB] rounded-2xl mx-1">
            {time}
          </Text>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <ScrollView>
      {doctor ? (
        <View className="flex">
          <Image className="w-full h-64" source={{ uri: doctor?.imageUrl }} />
          <View className="h-full bg-gray-100 rounded-t-3xl mt-[-24px] p-8">
            <Text className="font-[poppins-bold] text-2xl">
              Dr. {doctor.name}
            </Text>
            <Text className="font-[poppins-bold] text-md mt-[-6px]">
              {doctor.hospital}
            </Text>
            <Text className="font-[poppins-medium] text-md mt-[-6px] text-gray-500">
              {doctor.specialization}
            </Text>
            <View className="flex-row justify-between mt-6">
              <View className="flex-row">
                <MaterialIcons name="work" size={20} color="#0EE05B" />
                <Text className="font-[poppins-medium] text-[16px] ">
                  {" "}
                  {doctor.exp} years
                </Text>
              </View>
              <View className="flex-row">
                <MaterialIcons name="people" size={20} color="blue" />
                <Text className="font-[poppins-medium] text-[16px] ">
                  {" "}
                  {doctor.id.slice(-3)}+
                </Text>
              </View>
              <View className="flex-row">
                <MaterialIcons name="star" size={20} color="#EBE100" />
                <Text className="font-[poppins-medium] text-[16px] "> 4.5</Text>
              </View>
            </View>

            <View>
              <Text className="font-[poppins-bold] text-[17px] mt-4">
                Appointments Available
              </Text>
              <FlatList
                data={doctor.days?.map((day, index) => ({
                  day,
                  times: doctor.times,
                }))}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderAppointmentItem}
                showsVerticalScrollIndicator={false}
              />
            </View>

            <View>
              <Text className="font-[poppins-bold] text-[17px] mt-4">
                About
              </Text>
              <Text className="font-[poppins] text-[14px]">
                {doctor.description}
              </Text>
              <TouchableOpacity >
                <Text className="bg-[#607AFB] mt-4 p-3 text-white text-center rounded-lg font-[poppins-bold]">
                  Make an appointment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

export default Doctor;
