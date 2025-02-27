import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { db } from "../../configs/FirebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import LottieView from "lottie-react-native";

const AppointmentConfirmation = () => {
  const navigation = useNavigation();
  const { doctorId, userEmail, appointmentDate, appointmentTime } =
    useLocalSearchParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Screen navigation bar
  useEffect(() => {
    navigation.setOptions({
      title: "Make Appointment",
      headerTintColor: "#607AFB",
      headerTitleStyle: {
        color: "black",
      },
    });
  }, [navigation]);

  useEffect(() => {
    const getDoctorById = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching doctor: ", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    getDoctorById();
  }, [doctorId, userEmail]);

  const handleNavigationHome = () => {
    router.push("/(tabs)/home");
  };

  if (loading) {
    // Show loading spinner while fetching data
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          loop
          autoPlay
          className="mt-8"
          source={require("../../assets/loading.json")} // Path to the local json file
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/confirmation.png")}
        style={styles.image}
      />
      <Text style={styles.thankYouText}>Thank You!</Text>
      <Text style={styles.confirmationText}>
        Your appointment has been{"\n"}confirmed.
      </Text>
      <View style={styles.appointmentDetails}>
        <View style={styles.doctorInfo}>
          <Image
            style={styles.doctorImage}
            source={{ uri: doctor?.imageUrl }}
          />
          <View style={styles.doctorText}>
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
        </View>
        <View style={styles.appointmentInfo}>
          <Image
            source={require("../../assets/images/calender.webp")}
            style={styles.calendarIcon}
          />
          <View style={styles.appointmentText}>
            <Text style={styles.appointmentDate}>{appointmentDate}</Text>
            <Text style={styles.appointmentTime}>{appointmentTime}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={handleNavigationHome}>
        <Text style={styles.backToHomeText}>Back to home &gt;</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  appointmentDetails: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
    width: "85%",
    alignItems: "justify",
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  doctorText: {
    alignItems: "flex-start",
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  specialization: {
    fontSize: 14,
    color: "#777",
  },
  hospitalName: {
    fontSize: 14,
    color: "#777",
  },
  appointmentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    width: 50,
    height: 50,
    marginRight: 13,
  },
  appointmentText: {
    alignItems: "flex-start",
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  appointmentTime: {
    fontSize: 14,
    color: "#777",
  },
  backToHomeText: {
    marginTop: 26,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
});

export default AppointmentConfirmation;
