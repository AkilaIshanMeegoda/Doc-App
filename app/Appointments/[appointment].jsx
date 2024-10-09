import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { db } from "../../configs/FirebaseConfig";
import { Colors } from "../../constants/Colors";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import LottieView from "lottie-react-native";

const Appointment = () => {
  const { doctorId, userEmail } = useLocalSearchParams();
  const { user } = useUser();
  const navigation = useNavigation();
  const router = useRouter();

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [Loading, setLoading] = useState(false);

  // Get current user (patient) email
  const patientEmail = user.primaryEmailAddress.emailAddress;

  // Screen navigation bar
  useEffect(() => {
    navigation.setOptions({
      title: `Make Appointment`,
      headerTintColor: "#607AFB",
      headerTitleStyle: {
        color: "black",
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
          const doctorData = {
            id: doctorSnapshot.id,
            ...doctorSnapshot.data(),
          };
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

  const validateAppointment = () => {
    if (!selectedDate) {
      Alert.alert("Incomplete", "Please select a date");
      return false;
    }
    if (!selectedTime) {
      Alert.alert("Incomplete", "Please select a time");
      return false;
    }
    if (!fullName) {
      Alert.alert("Incomplete", "Please enter your name");
      return false;
    }
    if (!mobileNumber) {
      Alert.alert("Incomplete", "Please enter your mobile number");
      return false;
    }
    if (mobileNumber.length !== 10 || isNaN(mobileNumber)) {
      Alert.alert("Invalid Number", "Please enter a valid mobile number");
      return false;
    }
    return true;
  };

  const saveAppointmentDetails = async () => {
    if (!validateAppointment()) return;
    try {
      setLoading(true);
      // Query to find the hospital document based on the userEmail (or any other identifying attribute)
      const hospitalQuery = query(
        collection(db, "HospitalList"),
        where("userEmail", "==", userEmail)
      );

      const hospitalSnapshot = await getDocs(hospitalQuery);

      if (!hospitalSnapshot.empty) {
        const hospitalDocRef = hospitalSnapshot.docs[0].ref; // Get the reference of the first hospital doc

        // Reference to 'AppointmentList' sub-collection in the hospital document
        const appointmentCollectionRef = collection(
          hospitalDocRef,
          "AppointmentList"
        );

        // Save the appointment details to the 'AppointmentList' sub-collection
        await addDoc(appointmentCollectionRef, {
          doctorId: doctorId,
          patientName: fullName,
          patientEmail: patientEmail,
          patientMobile: mobileNumber,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          userEmail: userEmail,
          doctorName: doctor.name,
          doctorImage: doctor.imageUrl,
          doctorSpecialization: doctor.specialization,
          hospitalName: doctor.hospital,
          createdAt: new Date(), // Optional: Track when the appointment was created
        });

        console.log("Appointment saved successfully.");
        router.push({
          pathname: "/appointments/AppointmentConfirmation",
          params: {
            doctorId: doctorId,
            userEmail: userEmail,
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
          },
        });
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
  };

  return (
    <ScrollView style={styles.container}>
      {Loading ? (
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <LottieView
            loop
            autoPlay
            className="mt-32"
            source={require("../../assets/loading.json")} // Path to the local json file
            style={{ width: 200, height: 200 }}
          />
        </View>
      ) : doctor ? (
        <>
          <View style={styles.header}>
            <Image
              style={styles.doctorImage}
              source={{ uri: doctor.imageUrl }}
            />
            <Text style={styles.doctorName}>
              Dr.{doctor?.name || "Doctor's Name"}
            </Text>
            <Text style={styles.specialization}>
              {doctor?.specialization || "Doctor's Specialization"}
            </Text>
            <Text style={styles.hospitalName}>
              {doctor?.hospital || "Hospital's Name"}
            </Text>
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
          <TouchableOpacity
            style={styles.button}
            onPress={saveAppointmentDetails}
          >
            <Text style={styles.buttonText}>Confirm Appointment</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <LottieView
            loop
            autoPlay
            className="mt-32"
            source={require("../../assets/loading.json")} // Path to the local json file
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    padding: 20,
  },
  header: {
    alignItems: "center",
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
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  hospitalName: {
    fontSize: 16,
    color: "#777",
    marginBottom: 2,
  },
  specialization: {
    fontSize: 14,
    color: "#777",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  input: {
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 20,
  },
  button: {
    height: 50,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 34,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Appointment;
