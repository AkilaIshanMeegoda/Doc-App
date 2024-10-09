import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import StartPage2 from "./StartPage2";
import LoginScreen from "./LoginScreen"

// Import the local image
const onboardImage = require('./../../assets/images/startup1.png'); // Adjust the path as needed

const StartPage = () => {
  const [showLogin, setShowLogin] = useState(false); 
  const [skip, setSkip] = useState(false); 

  if (showLogin) {
    return <StartPage2 />;
  }
  if (skip) {
    return <LoginScreen />;
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
        Book Appointments with Ease
      </Text>

      {/* Image from local folder */}
      <Image 
        source={onboardImage} 
        style={{ 
          width: 230, 
          height: 400, 
          marginBottom: 20, 
          resizeMode: 'cover', // Change to cover for better fit
          borderRadius: 20,
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

      <TouchableOpacity 
        className="w-48"
        style={{
          backgroundColor: '#FF6464',
          paddingVertical: 10,
          paddingHorizontal: 60,
          borderRadius: 30,
          marginTop:10,
        }}
        onPress={() => setSkip(true)} // Navigate to StartPage2
      >
        <Text className="text-center font-[poppins-medium] text-md text-white">
          Skip
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartPage;
