import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Feather from "@expo/vector-icons/Feather"; // For icons
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router"; // Import useRouter
import { db } from '../../configs/FirebaseConfig'; // Import Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';
import AppointmentListCard from '../../components/AppointmentList/AppointmentListCard'; 
import { useUser } from "@clerk/clerk-expo";



const PatientPortal = () => {
  const router = useRouter(); // Initialize router
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress.emailAddress  ; // Use optional chaining



  useEffect(() => {
    const fetchAppointments = async () => {
      if (typeof userEmail !== 'string' || userEmail.trim() === '') {
        console.error('Invalid userEmail:', userEmail);
        setLoading(false);
        return;
      }
  
      try {
        const appointmentsQuery = query(
          collection(db, 'HospitalList'), // Collection containing appointments
          where('patientEmail', '==', userEmail)
        );
  
        const appointmentSnapshots = await getDocs(appointmentsQuery);
  
        const appointmentsData = [];
        for (const docSnapshot of appointmentSnapshots.docs) {
          const appointmentListRef = collection(docSnapshot.ref, 'AppointmentList');
          const appointmentDocs = await getDocs(appointmentListRef);
          appointmentDocs.forEach((appointment) => {
            appointmentsData.push({ id: appointment.id, ...appointment.data() });
          });
        }
  
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, [userEmail]);
  
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
          onPress={() =>
            router.push("/Portal/documentManage")
          } // Navigate to docManage
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
          onPress={() =>
            router.push("/Portal/healthMetric")
          } // Navigate to healthMetric
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

      {/* Appointment History */}
      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
            marginLeft: 4,
          }}
        >
          Appointment History
        </Text>
        {loading ? (
          <Text>Loading appointments...</Text>
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
    </View>
  );
};

export default PatientPortal;
