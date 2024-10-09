import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import StartPage4 from "./StartPage4";

// Import the local image for this page
const onboardImage3 = require('./../../assets/images/startup3.png'); // Adjust the path as needed

const StartPage3 = () => {
  const [showLogin, setShowLogin] = useState(false); 

  if (showLogin) {
    return <StartPage4 />;
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F8F8F8' // Background color matching the design
    }}>
      {/* Title */}
      <Text style={{ 
        fontSize: 32, 
        fontWeight: 'bold', 
        marginBottom: 10 
      }}>
        <Text style={{ color: '#5A67F2' }}>Med</Text>
        <Text style={{ color: '#000' }}>link</Text>
      </Text>

      {/* Subtitle */}
      <Text style={{
        fontSize: 16,
        color: '#7D7D7D',
        marginBottom: 20
      }}>
        Emergency? We’ve Got You Covered
      </Text>

      {/* Image from local folder */}
      <Image 
        source={onboardImage3} 
        style={{ 
          width: 230, 
          height: 400,
          marginBottom: 20, 
          resizeMode: 'cover', // Change to cover for better fit
          borderRadius: 20 
        }} 
      />

      {/* Dots indicator */}
      <View style={{
        flexDirection: 'row',
        marginBottom: 20
      }}>
        <View style={{ 
          width: 10, 
          height: 10, 
          borderRadius: 5, 
          backgroundColor: '#E0E0E0', 
          marginHorizontal: 5 
        }} />
        <View style={{ 
          width: 10, 
          height: 10, 
          borderRadius: 5, 
          backgroundColor: '#E0E0E0', 
          marginHorizontal: 5 
        }} />
        <View style={{ 
          width: 10, 
          height: 10, 
          borderRadius: 5, 
          backgroundColor: '#5A67F2', 
          marginHorizontal: 5 
        }} />
        <View style={{ 
          width: 10, 
          height: 10, 
          borderRadius: 5, 
          backgroundColor: '#E0E0E0', 
          marginHorizontal: 5 
        }} />
      </View>

      {/* Continue Button */}
      <TouchableOpacity 
        style={{
          backgroundColor: '#5A67F2',
          paddingVertical: 10,
          paddingHorizontal: 70,
          borderRadius: 30
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

export default StartPage3;
