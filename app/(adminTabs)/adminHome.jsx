import {
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator, // Import ActivityIndicator for the loading spinner
  LogBox,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import AppointmentListCard from "../../components/AppointmentList/AppointmentListCard";
import { useFocusEffect } from "expo-router";

const home = () => {
  const { user } = useUser();
  const [appointmentList, setAppointmentList] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]); // For filtered list
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const getAppointmentList = async () => {
    setLoading(true); // Start loading
    const hospitalQuery = query(
      collection(db, "HospitalList"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const hospitalSnapshot = await getDocs(hospitalQuery);

    if (!hospitalSnapshot.empty) {
      const hospitalDocRef = hospitalSnapshot.docs[0].ref;
      const appointmentQuery = collection(hospitalDocRef, "AppointmentList");
      const appointmentSnapshot = await getDocs(appointmentQuery);

      const newAppointmentList = [];
      appointmentSnapshot.forEach((doc) => {
        newAppointmentList.push({ id: doc.id, ...doc.data() });
      });
      setAppointmentList(newAppointmentList);
      setFilteredAppointments(newAppointmentList); // Initialize filtered list
    }
    setLoading(false); // End loading
  };

  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredAppointments(appointmentList); // Show full list if search query is empty
    } else {
      const filteredData = appointmentList.filter((appointment) =>
        appointment.patientName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAppointments(filteredData); // Filtered data
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getAppointmentList();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        getAppointmentList();
      }
    }, [user])
  );

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View className="p-6">
        {/* Search Bar */}
        <View className="flex-row px-4 py-3 text-lg bg-white border-2 border-gray-200 drop-shadow-2xl rounded-3xl">
          <Feather name="search" size={24} color={Colors.PRIMARY} />
          <TextInput
            className="flex-1 ml-2 text-lg text-gray-400"
            placeholder="Search Appointments"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Loading Indicator */}
        {loading ? (
          <View className="items-center mt-10">
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
            <Text className="mt-2 text-gray-500">Loading appointments...</Text>
          </View>
        ) : (
          /* Appointment List */
          <FlatList
            data={filteredAppointments} // Use filtered list for rendering
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <AppointmentListCard
                appointment={item}
                getAppointmentList={getAppointmentList}
              />
            )}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default home;
