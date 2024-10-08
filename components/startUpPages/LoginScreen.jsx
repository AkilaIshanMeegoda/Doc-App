import { useSignIn } from "@clerk/clerk-expo";
import { Text, TextInput, Button, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import SignUpScreen from "./SignUpScreen"; // Import the SignUpScreen component

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showSignUp, setShowSignUp] = useState(false); // Manage screen state

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  if (showSignUp) {
    // Render the SignUpScreen component if "showSignUp" is true
    return <SignUpScreen setShowSignUp={setShowSignUp} />;
  }

  // Otherwise, render the SignIn form
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F6FA", padding: 20 }}>
      <View className="flex-row">
      <Text style={{ fontSize: 40, fontWeight: "bold", color: "#607AFB", marginBottom: 10 ,fontFamily:"outfit"}}>Med</Text>
      <Text style={{ fontSize: 40, fontWeight: "bold", color: "#000", marginBottom: 10 ,fontFamily:"outfit"}}>link</Text>
      </View>
      <Image source={require('./../../assets/images/login.jpg')}
      style={{
        width:200,height:350,marginBottom:5,borderRadius:20,borderWidth:6,borderColor:'#000'}}/>
      <View className="flex-row">
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#607AFB" ,fontFamily:"outfit"}}>We Care </Text>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#000" ,fontFamily:"outfit"}}>About</Text>
      </View>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#607AFB",marginTop:-10, marginBottom: 10}}>Your Health</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email Address"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        style={{
          backgroundColor: "#fff",
          width: "100%",
          padding: 8,
          paddingHorizontal:20,
          borderRadius: 8,
          borderColor: "#DADCE0",
          borderWidth: 1,
          marginBottom: 20,
        }}
        placeholderTextColor="#9AA0A6"
      />
      
      <TextInput
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        style={{
          backgroundColor: "#fff",
          width: "100%",
          padding: 8,
          borderRadius: 8,
          paddingHorizontal:20,
          borderColor: "#DADCE0",
          borderWidth: 1,
          marginBottom: 20,
        }}
        placeholderTextColor="#9AA0A6"
      />
      
      <TouchableOpacity
        onPress={onSignInPress}
        style={{
          backgroundColor: "#607AFB",
          paddingVertical: 15,
          borderRadius: 8,
          width: "100%",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Sign In</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#5F6368" }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => setShowSignUp(true)}>
          <Text style={{ color: "#607AFB", fontWeight: "bold" }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
