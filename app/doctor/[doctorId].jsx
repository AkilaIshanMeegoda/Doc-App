import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  LogBox,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

const Doctor = () => {
  const navigation = useNavigation();
  const { doctorId,userEmail } = useLocalSearchParams();
  const [doctor, setDoctor] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    getDoctorById();
    console.log("Doctor ID from params:", doctorId);

  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: `Doctor Profile`,
      headerTintColor: '#607AFB', 
      headerTitleStyle: {
        color: 'black', 
      },
    });
  }, [navigation, doctorId]);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const getDoctorById = async () => {
    const hospitalQuery = query(
      collection(db, "HospitalList"),
      where("userEmail", "==", userEmail)
    );
    const hospitalSnapshot = await getDocs(hospitalQuery);

    if (!hospitalSnapshot.empty) {
      const hospitalDocRef = hospitalSnapshot.docs[0].ref;

      const doctorDocRef = doc(hospitalDocRef, "DoctorList", doctorId);
      const doctorSnapshot = await getDoc(doctorDocRef);

      if (doctorSnapshot.exists()) {
        const doctorData = { id: doctorSnapshot.id, ...doctorSnapshot.data() };
        setDoctor(doctorData);
      } else {
        console.log("No doctor found with the given doctorId");
      }
    } else {
      console.log("No hospital found for the current user");
    }
  };

  const renderAppointmentItem = ({ item }) => (
    <View className="flex-row justify-between my-1">
      <Text className="font-[poppins-medium] text-[14px] w-20">{item.day}</Text>
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

  const handleAppointment = () => {
    router.push({
      pathname: `/appointments/${doctor.id}`,
      params: { doctorId: doctor.id, userEmail: userEmail }
    });
  };

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
              {doctor.hospital || "No Hospital Provided"}
            </Text>
            <Text className="font-[poppins-medium] text-md mt-[-6px] text-gray-500">
              {doctor.specialization}
            </Text>

            {/* Doctor's Information */}
            <View className="flex-row justify-between mt-6">
              <View className="flex-row">
                <MaterialIcons name="work" size={20} color="#0EE05B" />
                <Text className="font-[poppins-medium] text-[16px]">
                  {" "}
                  {doctor.exp || 0} years
                </Text>
              </View>
              <View className="flex-row">
                <MaterialIcons name="people" size={20} color="blue" />
                <Text className="font-[poppins-medium] text-[16px]">
                  {" "}
                  {Math.floor(Math.random() * 10) * 100 + 100}+
                </Text>
              </View>
              <View className="flex-row">
                <MaterialIcons name="star" size={20} color="#EBE100" />
                <Text className="font-[poppins-medium] text-[16px]">
                  {" "}
                  {doctor.rating || "4.5"}
                </Text>
              </View>
            </View>

            {/* Appointments Section */}
            <View>
              <Text className="font-[poppins-bold] text-[17px] mt-4">
                Appointments Available
              </Text>
              {doctor.days && doctor.times ? (
                <FlatList
                  data={doctor.days.map((day) => ({
                    day,
                    times: doctor.times,
                  }))}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderAppointmentItem}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <Text className="font-[poppins] text-[14px] text-gray-500">
                  No appointments available at this time.
                </Text>
              )}
            </View>

            {/* About Section */}
            <View>
              <Text className="font-[poppins-bold] text-[17px] mt-4">
                About
              </Text>
              <Text className="font-[poppins] text-[14px]">
                {doctor.description || "No description available."}
              </Text>
              <TouchableOpacity
                onPress={handleAppointment}
              >
                <Text className="bg-[#607AFB] mt-4 p-3 text-white text-center rounded-lg font-[poppins-bold]">
                  Make an appointment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <Text className="p-4 text-center">Loading...</Text>
      )}
    </ScrollView>
  );
};

export default Doctor;
