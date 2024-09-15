import { Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, SignedIn, SignedOut, useOrganizationList   } from "@clerk/clerk-expo";
import { useEffect, useState } from 'react';
import { router } from "expo-router";
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

function AuthenticatedStack() {
  const { organizationList, isLoaded, setActive } = useOrganizationList(); // Moved inside the component
  const [role, setRole] = useState(null);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      // Find the admin organization from the loaded organization list
      const adminOrganization = organizationList.find(
        (org) => org.membership.role === 'admin'
      );

      // If the user is not an admin, redirect to the homepage
      if (!adminOrganization || adminOrganization.membership.role !== 'admin') {
        router.push('/'); // Replace '/' with the homepage URL
      } else {
        // If the user is an admin, set the role to 'admin'
        setRole('admin');
        setShowLoader(false);
      }
    }
  }, [isLoaded, organizationList]);

  if (showLoader) {
    return <Text>Loading...</Text>;
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
