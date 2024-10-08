import { View, Text, Button, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import StartPage3 from "./StartPage3"

const StartPage2 = () => {
  const [showLogin, setShowLogin] = useState(false); 

  if (showLogin) {
    return <StartPage3 />;
  }

  return (
    <View className="items-center flex-1 mt-20">
      <Text className="text-lg">page2</Text>
      <TouchableOpacity
        className="w-40 h-10 bg-blue-600 rounded-xl"
        onPress={() => setShowLogin(true)}
      >
        <Text className="text-center text-white">Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartPage2;
