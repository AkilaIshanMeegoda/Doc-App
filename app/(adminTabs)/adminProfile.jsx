import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

const profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
  };

  console.log(user.primaryEmailAddress.emailAddress);

  return (
    <View className="items-center flex-1">
      <LottieView
        loop
        autoPlay
        className="mt-32"
        source={require("../../assets/logout.json")} // Path to the local json file
        style={{ width: 200, height: 200 }}
      />
      <TouchableOpacity onPress={() => handleSignOut()}>
        <Text className="bg-red-600 mt-4 p-3 text-white text-center rounded-lg font-[poppins-bold] w-40">
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default profile;
