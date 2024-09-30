import { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { db } from '../../configs/FirebaseConfig';
import { collection, doc, addDoc, getDoc, getDocs, query, where } from "firebase/firestore";

const Appointment = () => {
  const { doctorId, userEmail } = useLocalSearchParams();
  const navigation = useNavigation();

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [Loading, setLoading] = useState(false);

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
  }, [doctorId, userEmail]);

  const saveAppointmentDetails = async () => {
    setLoading(true);
    try {
      // Query to find the hospital document based on the userEmail (or any other identifying attribute)
      const hospitalQuery = query(
        collection(db, "HospitalList"),
        where("userEmail", "==", userEmail) // Assuming userEmail links hospital and user
      );
  
      const hospitalSnapshot = await getDocs(hospitalQuery);
  
      if (!hospitalSnapshot.empty) {
        const hospitalDocRef = hospitalSnapshot.docs[0].ref; // Get the reference of the first hospital doc
  
        // Reference to 'AppointmentList' sub-collection in the hospital document
        const appointmentCollectionRef = collection(hospitalDocRef, "AppointmentList");
  
        // Save the appointment details to the 'AppointmentList' sub-collection
        await addDoc(appointmentCollectionRef, {
          doctorId: doctorId,
          patientName: fullName,
          patientMobile: mobileNumber,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          userEmail: userEmail,
          doctorName: doctor.name,
          doctorSpecialization: doctor.specialization,
          hospitalName: doctor.hospital,
          createdAt: new Date(), // Optional: Track when the appointment was created
        });
  
        console.log("Appointment saved successfully.");
      } else {
        console.log("No hospital found for the given user.");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
    }

    setLoading(false);
    setSelectedDate("");
    setSelectedTime("");
    setFullName("");
    setMobileNumber("");
    navigation.goBack()
  };

  return (
    <View style={styles.container}>
      {Loading ? (
        <ActivityIndicator size="large" color="#607AFB" />
      ) : doctor ? (
        <>
          <View style={styles.header}>
            <Image
              style={styles.doctorImage}
              source={{ uri: doctor.imageUrl }}
            />
            <Text style={styles.doctorName}>Dr. {doctor?.name || "Doctor's Name"}</Text>
            <Text style={styles.hospitalName}>{doctor?.hospital || "Hospital's Name"}</Text>
            <Text style={styles.specialization}>{doctor?.specialization || "Doctor's Specialization"}</Text>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedDate}
                onValueChange={(itemValue) => setSelectedDate(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Date" value="" />
                {doctor?.days?.map((day, index) => (
                  <Picker.Item key={index} label={day} value={day} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedTime}
                onValueChange={(itemValue) => setSelectedTime(itemValue)}
                style={styles.picker}
                // enabled={selectedDate !== ""}  // Enable time dropdown only if date is selected
              >
                <Picker.Item label="Time" value="" />
                {doctor?.times?.map((time, index) => (
                  <Picker.Item key={index} label={time} value={time} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Input fields for Full Name and Mobile Number */}
          <TextInput
            style={styles.input}
            placeholder="Your Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />

          {/* Confirm Appointment Button */}
          <TouchableOpacity style={styles.button} onPress={saveAppointmentDetails}>
            <Text style={styles.buttonText}>Confirm Appointment</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  hospitalName: {
    fontSize: 16,
    color: '#777',
    marginBottom: 2,
  },
  specialization: {
    fontSize: 14,
    color: '#777',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 20,
  },
  button: {
    height: 50,
    backgroundColor: '#607AFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Appointment;
