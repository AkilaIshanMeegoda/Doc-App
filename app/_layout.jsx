import { Slot, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useSession,
  useUser,
} from "@clerk/clerk-expo"; // Use Clerk hooks
import { useEffect, useState } from "react";
import { Text } from "react-native";
import StartPage from "../components/startUpPages/StartPage"
import { useFonts } from "expo-font";
import { configureNotificationBehavior } from "../utils/RemindNotificationPermission";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {
  useEffect(() => {
    configureNotificationBehavior(); // Configure notification behavior when app starts
  }, []);

  const [fontsLoaded] = useFonts({
    "poppins": require("./../assets/fonts/Poppins-Regular.ttf"),
    "poppins-medium": require("./../assets/fonts/Poppins-Medium.ttf"),
    "poppins-bold": require("./../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading Fonts...</Text>;
  }
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <SignedIn>
        <AuthenticatedStack />
      </SignedIn>
      <SignedOut>
        <StartPage/>
      </SignedOut>
    </ClerkProvider>
  );
}

function AuthenticatedStack() {
  const { user } = useUser(); 
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
     
      const userRole = user?.publicMetadata?.role || "member"; 
      setRole(userRole);
    }
  }, [user]);

  if (!role) {
    return <Text>Loading...</Text>; 
  }

  return (
    <>
      {role == "admin" ? (
        <Stack>
          <Stack.Screen name="(adminTabs)" options={{ headerShown: false }} />
        </Stack>
      ) : (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      )}
    </>
  );
}
