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
    <View className="flex-1">
      <Image
        className="w-32 h-32 mx-auto mt-4"
        source={require("../../assets/images/photo.png")}
      />

      <View className="flex-1 p-6">
        <Text className="font-[poppins-medium] text-xl ml-4">Name</Text>
        <TextInput
          className="p-2 px-4 mb-2 bg-white border-2 border-gray-200 rounded-xl font-[poppins-medium] text-md"
          placeholder="Enter your name"
        />
        <Text className="font-[poppins-medium] text-xl ml-4">Email</Text>
        <TextInput
          className="p-2 px-4 mb-2 bg-white border-2 border-gray-200 rounded-xl font-[poppins-medium] text-md"
          placeholder="Enter your email"
        />
        <Text className="font-[poppins-medium] text-xl ml-4">Address</Text>
        <TextInput
          className="p-2 px-4 mb-2 bg-white border-2 border-gray-200 rounded-xl font-[poppins-medium] text-md"
          placeholder="Enter your address"
        />
        <Text className="font-[poppins-medium] text-xl ml-4">
          Contact Number
        </Text>
        <TextInput
          className="p-2 px-4 mb-2 bg-white border-2 border-gray-200 rounded-xl font-[poppins-medium] text-md"
          placeholder="Enter your contact number"
        />

        <TouchableOpacity>
          <Text className="bg-[#607AFB] mt-4 p-3 text-white text-center rounded-lg font-[poppins-bold]">
            Save Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSignOut()}>
          <Text className="bg-red-600 mt-4 p-3 text-white text-center rounded-lg font-[poppins-bold]">
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default profile;
