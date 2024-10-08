import { View, Text, Button, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import StartPage4 from "./StartPage4"

const StartPage3 = () => {
  const [showLogin, setShowLogin] = useState(false); 

  if (showLogin) {
    return <StartPage4 />;
  }

  return (
    <View className="items-center flex-1 mt-20">
      <Text className="text-lg">page3</Text>
      <TouchableOpacity
        className="w-40 h-10 bg-blue-600 rounded-xl"
        onPress={() => setShowLogin(true)}
      >
        <Text className="text-center text-white">Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartPage3;
