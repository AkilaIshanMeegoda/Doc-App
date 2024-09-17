import { View, Text, TouchableOpacity, Image, ToastAndroid, Alert } from "react-native";
import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Colors } from "../../constants/Colors";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";

const DoctorListCard = ({ doctor, getDoctorList }) => {
  const OnDelete = () => {
    Alert.alert(
      "Do you want to Delete?",
      "Do you really want to delete this doctor profile?",
      [
        {
          text: "cancel",
          style: "cancel",
        },
        {
          text: "delete",
          style: "destructive",
          onPress: () => deleteDoctor(),
        },
      ]
    );
  };

  const deleteDoctor = async () => {
    console.log("Deleted Doctor Profile");
    const q = query(
      collection(db, "DoctorList"),
      where("name", "==", doctor?.name) 
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "DoctorList", docSnapshot.id));
    });

    console.log(doctor?.name);
    ToastAndroid.show("Doctor profile Deleted!", ToastAndroid.LONG);
    

    getDoctorList();
  };

  return (
    <TouchableOpacity className="flex-row items-center justify-between p-2 mt-4 bg-white shadow-xl h-28 rounded-2xl">
      <Image
        source={{ uri: doctor.imageUrl }}
        className="w-20 h-20 ml-4 rounded-full"
      />
      <View className="flex-1 ml-4">
        <View className="flex-row mr-4">
          <FontAwesome6 name="user-doctor" size={24} color={Colors.PRIMARY} />
          <View className="ml-4">
            <Text className="text-xl text-center font-[poppins-bold]">
              Dr. {doctor.name}
            </Text>
            <Text className=" text-center mt-[-4px] mb-2 font-[poppins-medium] text-gray-500">
              {doctor.specialization}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity className="w-20 bg-blue-500 shadow-2xl rounded-xl">
            <Text className="text-center text-white font-[poppins-medium]">
              Update
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => OnDelete()} className="w-20 mr-4 bg-red-600 shadow-2xl rounded-xl">
            <Text className="text-center text-white font-[poppins-medium]">
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DoctorListCard;

