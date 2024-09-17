import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather"; // For icons
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router"; // Import useRouter

const patientPortal = () => {
  const router = useRouter(); // Initialize router
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
          documents and health metrics.
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
            router.push("/components/patientPortalComponent/documentManage")
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
            router.push("/components/patientPortalComponent/healthMetric")
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
      <View style={{ marginTop: 10 }}>
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
      </View>
    </View>
  );
};

export default patientPortal;
