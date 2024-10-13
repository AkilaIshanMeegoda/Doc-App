import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../configs/FirebaseConfig";
import LottieView from "lottie-react-native";
import { useNavigation } from "expo-router";

const Profile = () => {
  const navigation = useNavigation();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true); // State for general loading
  const [saving, setSaving] = useState(false); // State for saving loading
  const [imageLoading, setImageLoading] = useState(false); // State for image loading
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
  };

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    setImage(result?.assets[0].uri);
  };

  const handleSaveDetails = async () => {
    setSaving(true); // Start loading when saving begins
    const fileName = Date.now().toString() + ".jpg";
    const resp = await fetch(image);
    const blob = await resp.blob();

    const imageRef = ref(storage, "Doc-App/" + fileName);
    uploadBytes(imageRef, blob)
      .then(() => {
        console.log("File Uploaded...");
      })
      .then(() => {
        getDownloadURL(imageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          await saveUserDetails(downloadUrl);
          setSaving(false); // Stop loading after save
          ToastAndroid.show(
            "User details saved successfully...",
            ToastAndroid.LONG
          );
        });
      });
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const userQuery = query(
          collection(db, "Users"),
          where("email", "==", user?.primaryEmailAddress?.emailAddress)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setName(userData.name);
          setEmail(userData.email);
          setAddress(userData.address);
          setContact(userData.contact);
          setImage(userData.imageUrl);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };
    getUser();
  }, []);

  const saveUserDetails = async (imageUrl) => {
    if (!name || !email || !address || !contact) {
      ToastAndroid.show("Please fill out all fields.", ToastAndroid.LONG);
      setSaving(false); // Stop loading if validation fails
      return;
    }

    const userQuery = query(
      collection(db, "Users"),
      where("email", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userDocRef = userSnapshot.docs[0].ref;

      await updateDoc(userDocRef, {
        name,
        email,
        address,
        contact,
        imageUrl,
      });
    } else {
      await addDoc(collection(db, "Users"), {
        name,
        email,
        address,
        contact,
        imageUrl,
      });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: `Profile`,
      headerTintColor: "#607AFB",
      headerTitleStyle: {
        color: "black",
      },
    });
  }, [navigation]);

  return (
    <ScrollView className="flex-1">
      {loading ? (
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <LottieView
            loop
            autoPlay
            className="mt-32"
            source={require("../../assets/loading.json")} // Path to the local json file
            style={{ width: 200, height: 200 }}
          />
        </View>
      ) : saving ? (
        // Show loading animation while saving
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <LottieView
            loop
            autoPlay
            className="mt-32"
            source={require("../../assets/loading.json")} // Replace with your saving animation
            style={{ width: 200, height: 200 }}
          />
        </View>
      ) : (
        <>
          <TouchableOpacity onPress={() => onImagePick()}>
            {imageLoading && <ActivityIndicator size="large" color="#0000ff" />}
            {!image ? (
              <Image
                className="w-32 h-32 mx-auto mt-4"
                source={require("../../assets/images/photo.png")}
              />
            ) : (
              <Image
                className="w-32 h-32 mx-auto mt-4 rounded-full"
                source={{ uri: image }}
                onLoadStart={() => setImageLoading(true)} // Start loading
                onLoadEnd={() => setImageLoading(false)} // End loading
              />
            )}
          </TouchableOpacity>

          <View className="flex-1 p-6">
            <Text className="font-[poppins-medium] text-xl ml-4">Name</Text>
            <TextInput
              value={name}
              onChangeText={(v) => setName(v)}
              className="p-2 px-4 mb-2 bg-white border-2 border-gray-200 rounded-xl font-[poppins-medium] text-md"
              placeholder="Enter your name"
            />
            <Text className="font-[poppins-medium] text-xl ml-4">Email</Text>
            <TextInput
              value={email}
              onChangeText={(v) => setEmail(v)}
              className="p-2 px-4 mb-2 bg-white border-2 border-gray-200 rounded-xl font-[poppins-medium] text-md"
              placeholder="Enter your email"
            />
            <Text className="font-[poppins-medium] text-xl ml-4">Address</Text>
            <TextInput
              value={address}
              onChangeText={(v) => setAddress(v)}
              className="p-2 px-4 mb-2 bg-white border-2 border-gray-200 rounded-xl font-[poppins-medium] text-md"
              placeholder="Enter your address"
            />
            <Text className="font-[poppins-medium] text-xl ml-4">
              Contact Number
            </Text>
            <TextInput
              value={contact}
              onChangeText={(v) => setContact(v)}
              className="p-2 px-4 mb-2 bg-white border-2 border-gray-200 rounded-xl font-[poppins-medium] text-md"
              placeholder="Enter your contact number"
            />

            <TouchableOpacity onPress={() => handleSaveDetails()}>
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
        </>
      )}
    </ScrollView>
  );
};

export default Profile;
