import {
  View,
  Text,
  FlatList,
  ScrollView,
  LogBox,
  RefreshControl,
  ActivityIndicator, // Import ActivityIndicator for the loading spinner
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import ManageDoctorHeader from "../../components/Admin/ManageDoctorHeader";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../constants/Colors";
import { db } from "../../configs/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import DoctorListCard from "../../components/DoctorList/DoctorListCard";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";

const ManageDoctors = () => {
  const { user } = useUser();
  const [doctorList, setDoctorList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const getDoctorList = async () => {
    setLoading(true); // Start loading
    const hospitalQuery = query(
      collection(db, "HospitalList"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const hospitalSnapshot = await getDocs(hospitalQuery);

    if (!hospitalSnapshot.empty) {
      const hospitalDocRef = hospitalSnapshot.docs[0].ref;
      const doctorQuery = collection(hospitalDocRef, "DoctorList");
      const doctorSnapshot = await getDocs(doctorQuery);

      const newDoctorList = [];
      doctorSnapshot.forEach((doc) => {
        newDoctorList.push({ id: doc.id, ...doc.data() });
      });
      setDoctorList(newDoctorList);
    }
    setLoading(false); // End loading
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getDoctorList();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        getDoctorList();
      }
    }, [user])
  );

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <ManageDoctorHeader />

      <View className="p-6">
        {/* Loading Indicator */}
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
        ) : (
          <FlatList
            data={doctorList}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <DoctorListCard doctor={item} getDoctorList={getDoctorList} />
            )}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default ManageDoctors;
