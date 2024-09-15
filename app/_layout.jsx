import { Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, SignedIn, SignedOut, useSession, useUser } from "@clerk/clerk-expo"; // Use Clerk hooks
import { useEffect, useState } from 'react';
import { Text } from "react-native";
import LoginScreen from '../components/LoginScreen';

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
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <SignedIn>
        <AuthenticatedStack />
      </SignedIn>
      <SignedOut>
        <LoginScreen />
      </SignedOut>
    </ClerkProvider>
  );
}

// Separated the authenticated stack logic into a new component
function AuthenticatedStack() {
  const { session } = useSession(); // Get the session data using useSession
  const { user } = useUser(); // Get the user information using useUser
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      // Assuming you store roles in user metadata
      const userRole = user?.publicMetadata?.role || 'user'; // Example of how to access the role
      setRole(userRole);
    }
  }, [user]);

  if (!role) {
    return <Text>Loading...</Text>; // Loader while role is determined
  }

  return (
    <>
      {role === 'admin' ? (
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
