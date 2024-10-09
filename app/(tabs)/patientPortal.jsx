import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather"; // For icons
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router"; // Import useRouter
import { db } from "../../configs/FirebaseConfig"; // Import Firebase config
import { collection, query, getDocs } from "firebase/firestore";
import AppointmentListCard from "../../components/AppointmentList/AppointmentListCard";
import { useUser } from "@clerk/clerk-expo";
import LottieView from "lottie-react-native";

const PatientPortal = () => {
  const router = useRouter(); // Initialize router
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    const fetchAppointments = async () => {
      if (
        !userEmail ||
        typeof userEmail !== "string" ||
        userEmail.trim() === ""
      ) {
        console.error("Invalid userEmail:", userEmail); // Handle case where email is invalid
        setLoading(false);
        return;
      }

      try {
        // Query for all hospitals
        const hospitalsQuery = collection(db, "HospitalList");
        const hospitalsSnapshot = await getDocs(hospitalsQuery); // Fetch hospital documents

        const appointmentsData = []; // To hold the fetched appointment data

        for (const docSnapshot of hospitalsSnapshot.docs) {
          const appointmentListRef = collection(
            docSnapshot.ref,
            "AppointmentList"
          ); // Reference to the subcollection
          const appointmentsSnapshot = await getDocs(appointmentListRef); // Fetch appointment docs from subcollection

          // Collect appointment data from the subcollection where patientEmail matches
          appointmentsSnapshot.forEach((doc) => {
            const appointmentData = doc.data();
            if (appointmentData.patientEmail === userEmail) {
              // Check if patientEmail matches
              appointmentsData.push({
                id: doc.id,
                ...appointmentData, // Spread the data from the appointment doc
              });
            }
          });
        }

        setAppointments(appointmentsData); // Set the state with appointment data
      } catch (error) {
        console.error("Error fetching appointments:", error); // Handle errors
      } finally {
        setLoading(false); // Turn off loading spinner
      }
    };

    fetchAppointments(); // Call the function when component mounts
  }, [userEmail]);

  // Render loading state
  if (loading) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 32 }}>
        <LottieView
          loop
          autoPlay
          className="mt-32"
          source={require("../../assets/loading.json")} // Path to the local json file
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: Colors.patientPortal.background,
      }}
    >
      {/**Info Text */}
      <View style={{ marginVertical: 20, paddingHorizontal: 10, marginTop: 6 }}>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: Colors.patientPortal.textPrimary,
            lineHeight: 22,
            fontWeight: "400",
          }}
        >
          Access various patient-related sections like appointment history,
          documents, and health metrics.
        </Text>
      </View>

      {/* Navigation */}
      <View style={{ marginTop: -5 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
            marginLeft: 4,
          }}
        >
          Navigation
        </Text>

        {/* Document Management */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.patientPortal.buttonBackground,
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
            elevation: 1,
            shadowColor: Colors.patientPortal.textSecondary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          onPress={() => router.push("/Portal/documentManage")} // Navigate to docManage
        >
          <Feather
            name="folder"
            size={24}
            color={Colors.patientPortal.iconColor}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Document Management
            </Text>
            <Text>Manage your health documents</Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color={Colors.patientPortal.iconColor}
          />
        </TouchableOpacity>

        {/* Health Metrics */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.patientPortal.buttonBackground,
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
            elevation: 1,
            shadowColor: Colors.patientPortal.textSecondary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          onPress={() => router.push("/Portal/healthMetric")} // Navigate to healthMetric
        >
          <Feather
            name="bar-chart"
            size={24}
            color={Colors.patientPortal.iconColor}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Health Metrics
            </Text>
            <Text>Log and view your health metrics</Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color={Colors.patientPortal.iconColor}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          padding: 10,
          backgroundColor: Colors.patientPortal.background,
        }}
      >
        <View style={{ width: "100%", marginBottom: 10 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              color: Colors.patientPortal.textPrimary,
            }}
          >
            Appointment History
          </Text>
        </View>
        {/* Appointment History */}
        <View style={{ flex: 1, padding: 16 }}>
          {appointments.length === 0 ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 18, color: Colors.gray }}>
                No Appointments Found
              </Text>
            </View>
          ) : (
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <AppointmentListCard appointment={item} />
              )} // Render each appointment
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default PatientPortal;
