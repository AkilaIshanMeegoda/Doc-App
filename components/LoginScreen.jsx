import { useSignIn } from "@clerk/clerk-expo";
import { Text, TextInput, Button, View, TouchableOpacity } from "react-native";
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
    <View style={{ alignItems: "center", flex: 1, marginTop: 96 }}>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        style={{ marginBottom: 10, borderBottomWidth: 1, width: '80%' }}
      />
      <TextInput
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        style={{ marginBottom: 10, borderBottomWidth: 1, width: '80%' }}
      />
      <Button title="Sign In" onPress={onSignInPress} />
      <View style={{ marginTop: 20 }}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity 
          onPress={() => setShowSignUp(true)} // Toggle the screen to SignUp
          style={{ padding: 10, backgroundColor: "blue", borderRadius: 5, marginTop: 10 }}
        >
          <Text style={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
