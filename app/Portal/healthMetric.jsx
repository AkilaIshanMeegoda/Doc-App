import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Alert,  // Import Alert for validation alerts
} from "react-native";
import React, { useState, useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../constants/Colors";
import { db } from "./../../configs/FirebaseConfig"; // Import  Firebase configuration
import firebase from "firebase/app"; // Import Firebase
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import HealthGraph from "./../../components/Graphs/HealthGraph"; // Import HealthGraph component
import { useNavigation } from "expo-router";

const HealthMetric = () => {
  const [bloodPressure, setBloodPressure] = useState("");
  const [diabetesLevel, setDiabetesLevel] = useState("");
  const [email, setEmail] = useState(""); // State to store user email
  const { user } = useUser(); // Retrieve user from hook
  const navigation = useNavigation(); // Get navigation object
  const [successMessage, setSuccessMessage] = useState(""); // State for success message


  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress); // Set email when user is available
    }

    // Set the header title
    navigation.setOptions({
      title: "Health Metrics",
    });
  }, [user]);


  const validateInputs = () => {
    let error = "";

    if (!bloodPressure || !diabetesLevel) {
      error = "Both fields are required.";
    } else if (isNaN(bloodPressure) || isNaN(diabetesLevel)) {
      error = "Both values must be numeric.";
    } else if (bloodPressure < 50 || bloodPressure > 200) {
      error = "Blood pressure must be between 50 and 200 mmHg.";
    } else if (diabetesLevel < 50 || diabetesLevel > 500) {
      error = "Diabetes level must be between 50 and 500 mg/dL.";
    }

    if (error) {
      // Show an alert with the validation message
      Alert.alert("Validation Error", error, [{ text: "OK" }]);
      return false;
    }

    return true;
  };

  const logMetrics = async () => {
    if (!email) {
      console.error("User is not authenticated");
      return;
    }

    if (!validateInputs()) {
      return; // Stop submission if validation fails
    }

    try {
      const metricsCollection = collection(db, "healthMetrics");
      await addDoc(metricsCollection, {
        email, // Store the user's email
        bloodPressure,
        diabetesLevel,
        submittedAt: serverTimestamp(), // Record the submission date
      });

      console.log("Metrics saved successfully");
      // Show success message using Toast
      ToastAndroid.show("Metrics logged successfully!", ToastAndroid.SHORT);
      setBloodPressure("");
      setDiabetesLevel("");

      // Clear the message after a delay
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving metrics: ", error);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: Colors.patientPortal.background,
      }}
    >
      {/* Header */}
      <View style={{ marginVertical: 20, paddingHorizontal: 10, marginTop: 6 }}>
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            fontWeight: "bold",
            color: Colors.patientPortal.textPrimary,
          }}
        >
          Health Metrics
        </Text>
        <Text style={{ fontSize: 16, textAlign: "center", lineHeight: 22 }}>
          Log diabetes levels and blood pressure. View graphical trends over
          time.
        </Text>
      </View>

      {/* Log Health Metrics */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Log Health Metrics
        </Text>


        <TextInput
          style={{
            backgroundColor: Colors.patientPortal.buttonBackground,
            padding: 10,
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 1, // Add this line
            borderColor: "gray", // Change the border color to gray
          }}
          placeholder="Enter your blood pressure (mmHg)"
          keyboardType="numeric"
          value={bloodPressure}
          onChangeText={setBloodPressure}
        />

        <TextInput
          style={{
            backgroundColor: Colors.patientPortal.buttonBackground,
            padding: 10,
            marginBottom: 20,
            borderRadius: 10,
            borderWidth: 1, // Add this line
            borderColor: "gray", // Change the border color to gray
          }}
          placeholder="Enter your diabetes level (mg/dL)"
          keyboardType="numeric"
          value={diabetesLevel}
          onChangeText={setDiabetesLevel}
        />

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.patientPortal.iconColor,
            padding: 15,
            borderRadius: 10,
          }}
          onPress={logMetrics}
        >
          <Feather
            name="check-circle"
            size={24}
            color={Colors.patientPortal.background}

          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: Colors.patientPortal.background,
              }}
            >
              Log Metrics
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Display the health metrics graph */}
      <View style={{ marginVertical: 20 }}>
        <HealthGraph />
      </View>
    </ScrollView>
  );
};

export default HealthMetric;
