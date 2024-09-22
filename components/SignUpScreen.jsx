import * as React from "react";
import { TextInput, Button, View, TouchableOpacity, Text } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import LoginScreen from "./LoginScreen";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [showLogin, setShowLogin] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (showLogin) {
    // Render the SignUpScreen component if "showSignUp" is true
    return <LoginScreen setShowLogin={setShowLogin} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F6FA", padding: 20 }}>
      <Text style={{ fontSize: 32, fontWeight: "bold", color: "#607AFB", marginBottom: 40 }}>Create an Account</Text>

      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email Address"
            onChangeText={setEmailAddress}
            style={{
              backgroundColor: "#fff",
              width: "100%",
              padding: 15,
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
            onChangeText={setPassword}
            style={{
              backgroundColor: "#fff",
              width: "100%",
              padding: 15,
              borderRadius: 8,
              borderColor: "#DADCE0",
              borderWidth: 1,
              marginBottom: 20,
            }}
            placeholderTextColor="#9AA0A6"
          />
          <TouchableOpacity
            onPress={onSignUpPress}
            style={{
              backgroundColor: "#607AFB",
              paddingVertical: 15,
              borderRadius: 8,
              width: "100%",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowLogin(true)} style={{ marginTop: 10 }}>
            <Text style={{ color: "#607AFB", fontWeight: "bold" }}>Already have an account? Login</Text>
          </TouchableOpacity>
        </>
      )}

      {pendingVerification && (
        <>
          <TextInput
            value={code}
            placeholder="Verification Code"
            onChangeText={setCode}
            style={{
              backgroundColor: "#fff",
              width: "100%",
              padding: 15,
              borderRadius: 8,
              borderColor: "#DADCE0",
              borderWidth: 1,
              marginBottom: 20,
            }}
            placeholderTextColor="#9AA0A6"
          />
          <TouchableOpacity
            onPress={onPressVerify}
            style={{
              backgroundColor: "#607AFB",
              paddingVertical: 15,
              borderRadius: 8,
              width: "100%",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Verify Email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
