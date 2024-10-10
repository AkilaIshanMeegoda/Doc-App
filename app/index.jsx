import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { LogBox } from "react-native";

export default function Index() {
  LogBox.ignoreAllLogs()
  const { user } = useUser(); // Get the user information using useUser
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      const userRole = user?.publicMetadata?.role || "member";
      setRole(userRole);
    }
  }, []);
  
  return (
    <>
      {role === "admin" ? (
        <Redirect href="/adminHome" />
      ) : (
        <Redirect href="/home" />
      )}
    </>
  );
}
