import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useState, useCallback } from "react";
import ManageDoctorHeader from "../../components/Admin/ManageDoctorHeader";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../constants/Colors";
import { db } from "../../configs/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import DoctorListCard from "../../components/DoctorList/DoctorListCard";
import { useFocusEffect } from "@react-navigation/native";

const ManageDoctors = () => {
  const { user } = useUser();
  const [doctorList, setDoctorList] = useState([]);

  const getDoctorList = async () => {
    const q = query(
      collection(db, "DoctorList"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const querySnapshot = await getDocs(q);

    const newDoctorList = [];
    querySnapshot.forEach((doc) => {
      newDoctorList.push(doc.data());
    });
    setDoctorList(newDoctorList);
  };

  useFocusEffect(
    useCallback(() => {
      getDoctorList();
    }, [user]) 
  );

  return (
    <ScrollView>
      <ManageDoctorHeader />

      <View className="p-6">
        <View className="flex-row px-4 py-3 text-lg bg-white border-2 border-gray-200 drop-shadow-2xl rounded-3xl">
          <Feather name="search" size={24} color={Colors.PRIMARY} />
          <Text className="ml-2 text-lg text-gray-400">Search Doctor</Text>
        </View>

        <FlatList
          data={doctorList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <DoctorListCard doctor={item} key={index} />
          )}
        />
      </View>
    </ScrollView>
  );
};

export default ManageDoctors;