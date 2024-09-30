import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { db } from '../../configs/FirebaseConfig';
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

const Appointment = () => {
  const navigation = useNavigation();
  const { doctorId, userEmail } = useLocalSearchParams();
  const [doctor, setDoctor] = useState(null);

  // Screen navigation bar
  useEffect(() => {
    navigation.setOptions({
      title: `Make Appointment`,
      headerTintColor: '#607AFB', 
      headerTitleStyle: {
        color: 'black', 
      },
    });
  }, [navigation, doctorId]);

  useEffect(() => {
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

    getDoctorById();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.doctorImage}
        source={{ uri: doctor?.imageUrl }}
      />
      <Text style={styles.doctorName}>{doctor?.name || "Doctor's Name"}</Text>
      <Text style={styles.specialization}>{doctor?.specialization || "Doctor's Specialization"}</Text>
      <Text style={styles.hospitalName}>{doctor?.hospital || "Hospital's Name"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  specialization: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  hospitalName: {
    fontSize: 16,
    color: '#555',
  },
});

export default Appointment;