import { View, Text, TouchableOpacity, ScrollView } from "react-native"; 
import React from "react";
import Feather from "@expo/vector-icons/Feather"; 
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router"; 

const documentManage = () => {
  const router = useRouter(); 
  return (
    <View
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
          Health Manager
        </Text>
        <Text style={{ fontSize: 16, textAlign: "center", lineHeight: 22 }}>
          View, upload health documents. Options to view, upload documents.
        </Text>
      </View>

      {/* Upload Document */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.patientPortal.buttonBackground,
          padding: 15,
          marginBottom: 20,
          borderRadius: 10,
          elevation: 1,
          shadowColor: Colors.patientPortal.textSecondary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
        onPress={() => console.log("Upload Document")} // Action for upload
      >
        <Feather name="upload" size={24} color={Colors.patientPortal.iconColor} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Upload Document</Text>
        </View>
      </TouchableOpacity>

      {/* Your Documents */}
      <ScrollView>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Your Documents
          </Text>
          {/* Placeholder for document items */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.patientPortal.cardBackground,
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
            }}
            onPress={() => console.log("View Document")} // Action for viewing document
          >
            <Feather name="file-text" size={24} color={Colors.patientPortal.iconColor} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 16 }}>Blood Test Results</Text>
              <Text style={{ fontSize: 12, color: Colors.patientPortal.textSecondary }}>
                Uploaded on Jan 15, 2023
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.patientPortal.cardBackground,
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
            }}
            onPress={() => console.log("View Document")} // Action for viewing document
          >
            <Feather name="file-text" size={24} color={Colors.patientPortal.iconColor} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 16 }}>X-ray Report</Text>
              <Text style={{ fontSize: 12, color: Colors.patientPortal.textSecondary }}>
                Uploaded on Feb 5, 2023
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default documentManage;
