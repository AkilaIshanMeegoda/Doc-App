import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { db } from "../../configs/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import AppointmentListCard from "../../components/AppointmentList/AppointmentListCard"; // Assuming it's in the same folder
import LottieView from "lottie-react-native";

const AppointmentHistory = ({ userEmail }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsQuery = query(
          collection(db, "HospitalList"), // Assuming HospitalList is the collection containing appointments
          where("userEmail", "==", userEmail)
        );

        const appointmentSnapshots = await getDocs(appointmentsQuery);

        const appointmentsData = [];
        appointmentSnapshots.forEach((docSnapshot) => {
          const appointmentListRef = collection(
            docSnapshot.ref,
            "AppointmentList"
          );
          getDocs(appointmentListRef).then((appointmentDocs) => {
            appointmentDocs.forEach((appointment) => {
              appointmentsData.push({
                id: appointment.id,
                ...appointment.data(),
              });
            });
            setAppointments(appointmentsData);
            setLoading(false);
          });
        });
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [userEmail]);

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {loading ? (
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <LottieView
            loop
            autoPlay
            className="mt-32"
            source={require("../../assets/loading.json")} // Path to the local json file
            style={{ width: 200, height: 200 }}
          />
        </View>
      ) : appointments.length === 0 ? (
        <Text>No appointments found</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AppointmentListCard appointment={item} />}
        />
      )}
    </View>
  );
};

export default AppointmentHistory;
