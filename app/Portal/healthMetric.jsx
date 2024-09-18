import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../constants/Colors";
import { db } from "./../../configs/FirebaseConfig"; // Import  Firebase configuration
import firebase from "firebase/app"; // Import Firebase
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import HealthGraph from "./../../components/Graphs/HealthGraph"; // Import HealthGraph component


const HealthMetric = () => {
  const [bloodPressure, setBloodPressure] = useState("");
  const [diabetesLevel, setDiabetesLevel] = useState("");
  const [email, setEmail] = useState(""); // State to store user email
  const { user } = useUser(); // Retrieve user from hook

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress); // Set email when user is available
    }
  }, [user]);

  const logMetrics = async () => {
    if (!email) {
      console.error("User is not authenticated");
      return;
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
      setBloodPressure("");
      setDiabetesLevel("");
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
            backgroundColor: Colors.patientPortal.background,
            padding: 10,
            marginBottom: 10,
            borderRadius: 10,
          }}
          placeholder="Enter your blood pressure"
          keyboardType="numeric"
          value={bloodPressure}
          onChangeText={setBloodPressure}
        />

        <TextInput
          style={{
            backgroundColor: Colors.patientPortal.background,
            padding: 10,
            marginBottom: 20,
            borderRadius: 10,
          }}
          placeholder="Enter your diabetes level"
          keyboardType="numeric"
          value={diabetesLevel}
          onChangeText={setDiabetesLevel}
        />

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.patientPortal.buttonBackground,
            padding: 15,
            borderRadius: 10,
          }}
          onPress={logMetrics}
        >
          <Feather
            name="check-circle"
            size={24}
            color={Colors.patientPortal.iconColor}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Log Metrics</Text>
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
