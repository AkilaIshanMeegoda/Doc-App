import EmergencyHeader from "../../components/User/EmergencyHeader";
import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  Easing,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { Share, Alert ,Linking} from "react-native";
import * as Location from "expo-location";
import { useState } from "react";

const emergency = () => {
  const [location, setLocation] = useState(null);

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission to access location was denied");
      return;
    }

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync();
    setLocation({ latitude, longitude });
  };

  const sendLocationToWhatsApp = async () => {
    if (!location) {
      Alert.alert("Location not available", "Please wait for the location to be updated.");
      return;
    }

    const message = `Hey, here's my live location: https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    
    const phoneNumber = '+94763899553'; // Replace with the phone number you want to send the message to (in international format, e.g., +1234567890)
    
    const url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumber}`;

    // Check if WhatsApp is installed
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("WhatsApp is not installed");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  useEffect(() => {
    fetchLocation();
  }, []);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.5, // Scale the circle up
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1, // Scale back down
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    const opacityAnimationLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnimation, {
          toValue: 0.5, // Reduce opacity
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1, // Bring back full opacity
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    blinkAnimation.start();
    opacityAnimationLoop.start();
  }, [scaleAnimation, opacityAnimation]);

  return (
    <View className="flex-1">
      <EmergencyHeader />

      <View>
        <Text className="font-[poppins-bold] text-xl text-center mt-12">
          Having an Emergency?
        </Text>
        <Text className="font-[poppins] text-lg text-center mt-8 text-gray-500">
          Press the button below
        </Text>
        <Text className="font-[poppins] text-lg text-center text-gray-500 mt-[-8px]">
          help will arrive soon
        </Text>
      </View>

      <View className="mt-40">
        <TouchableOpacity
          onPress={sendLocationToWhatsApp}
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Animated.View
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: "#FFA3A3", // Outer circle
              opacity: opacityAnimation,
              transform: [{ scale: scaleAnimation }],
            }}
          />
          <Animated.View
            style={{
              position: "absolute",
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: "#FF7B7B", // Middle circle
              opacity: opacityAnimation,
              transform: [{ scale: scaleAnimation }],
            }}
          />
          <Animated.View
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#FF5252", // Inner circle
              opacity: opacityAnimation,
              transform: [{ scale: scaleAnimation }],
            }}
          />
          <MaterialIcons
            name="emergency-share"
            size={52}
            color="white"
            style={{ position: "absolute" }}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-40">
        <Text className="font-[poppins-bold] text-xl text-center ">
          Share your location{" "}
        </Text>
        <Entypo name="location" size={24} color="red" />
      </View>

      <View className="flex-row justify-between mx-4 mt-4">
        <Image
          className="w-40 h-20 mt-4 rounded-xl"
          source={require("./../../assets/images/hospital1.jpg")}
        />
        <Image
          className="w-40 h-20 mt-4 rounded-xl"
          source={require("./../../assets/images/hospital2.png")}
        />
      </View>
    </View>
  );
};

export default emergency;
