import { Button, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

const profile = () => {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="items-center flex-1">
      <TouchableOpacity  onPress={handleSignOut}>
        <Text className="p-2 mt-24 text-xl text-white bg-blue-600 rounded-xl">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};
export default profile;
