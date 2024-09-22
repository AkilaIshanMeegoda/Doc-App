import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
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
