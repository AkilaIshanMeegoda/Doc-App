import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import StartPage3 from "./StartPage3";
import LottieView from "lottie-react-native";

// Import the local image for this page
const onboardImage2 = require("./../../assets/images/startup2.png"); // Adjust the path as needed

const StartPage2 = () => {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <StartPage3 />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F8F8", // Background color matching the design
      }}
    >
      {/* Title */}
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          marginBottom: 30,
          fontFamily: "poppins",
        }}
      >
        <Text
          style={{ color: "#5A67F2", fontFamily: "poppins", fontWeight: 700 }}
        >
          Med
        </Text>
        <Text style={{ color: "#000", fontFamily: "poppins", fontWeight: 700 }}>
          link
        </Text>
      </Text>

      {/* Image from local folder */}
      <LottieView
        loop
        autoPlay
        source={require("../../assets/emergency.json")} // Replace with your saving animation
        style={{ width: 300, height: 300 }}
      />

      <Text
        style={{
          fontSize: 18,
          color: "#7D7D7D",
          marginBottom: 20,
          paddingHorizontal: 20,
          textAlign: "center",
          fontFamily: "poppins",
          fontWeight: 600,
        }}
      >
        Share your live location instantly in emergencies
      </Text>

      {/* Dots indicator */}
      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: "#E0E0E0",
            marginHorizontal: 5,
          }}
        />
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: "#5A67F2",
            marginHorizontal: 5,
          }}
        />
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: "#E0E0E0",
            marginHorizontal: 5,
          }}
        />
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: "#E0E0E0",
            marginHorizontal: 5,
          }}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#5A67F2",
          paddingVertical: 10,
          paddingHorizontal: 70,
          borderRadius: 30,
        }}
        onPress={() => setShowLogin(true)} // Navigate to StartPage2
      >
        <Text className="text-center font-[poppins-medium] text-md text-white">
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartPage2;
