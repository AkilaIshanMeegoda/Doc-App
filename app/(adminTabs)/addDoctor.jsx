import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "./../../configs/FirebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";
import AddDoctorHeader from "../../components/Admin/AddDoctorHeader";
import { Colors } from "../../constants/Colors";
import { useNavigation } from "expo-router";

const addDoctor = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [image, setImage] = useState(null);
  const [docName, setDocName] = useState(null);
  const [specialization, setSpecialization] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [exp, setExp] = useState(null);
  const [description, setDescription] = useState(null);
  const [selected, setSelected] = React.useState([]);
  const [daySelected, setDaySelected] = React.useState([]);
  const day = [
    { key: "1", value: "Monday" },
    { key: "2", value: "Tuesday" },
    { key: "3", value: "Wednesday" },
    { key: "4", value: "Thursday" },
    { key: "5", value: "Friday" },
    { key: "6", value: "Saturday" },
    { key: "7", value: "Sunday" },
  ];

  const data = [
    { key: "1", value: "12.00 A.M" },
    { key: "2", value: "12.30 A.M" },
    { key: "3", value: "1.00 A.M" },
    { key: "4", value: "1.30 A.M" },
    { key: "5", value: "2.00 A.M" },
    { key: "6", value: "2.30 A.M" },
    { key: "7", value: "3.00 A.M" },
    { key: "8", value: "3.30 A.M" },
    { key: "9", value: "4.00 A.M" },
    { key: "10", value: "4.30 A.M" },
    { key: "11", value: "5.00 A.M" },
    { key: "12", value: "5.30 A.M" },
    { key: "13", value: "6.00 A.M" },
    { key: "14", value: "6.30 A.M" },
    { key: "15", value: "7.00 A.M" },
    { key: "16", value: "7.30 A.M" },
    { key: "17", value: "8.00 A.M" },
    { key: "18", value: "8.30 A.M" },
    { key: "19", value: "9.00 A.M" },
    { key: "20", value: "9.30 A.M" },
    { key: "21", value: "10.00 A.M" },
    { key: "22", value: "10.30 A.M" },
    { key: "23", value: "11.00 A.M" },
    { key: "24", value: "11.30 A.M" },
    { key: "25", value: "12.00 P.M" },
    { key: "26", value: "12.30 P.M" },
    { key: "27", value: "1.00 P.M" },
    { key: "28", value: "1.30 P.M" },
    { key: "29", value: "2.00 P.M" },
    { key: "30", value: "2.30 P.M" },
    { key: "31", value: "3.00 P.M" },
    { key: "32", value: "3.30 P.M" },
    { key: "33", value: "4.00 P.M" },
    { key: "34", value: "4.30 P.M" },
    { key: "35", value: "5.00 P.M" },
    { key: "36", value: "5.30 P.M" },
    { key: "37", value: "6.00 P.M" },
    { key: "38", value: "6.30 P.M" },
    { key: "39", value: "7.00 P.M" },
    { key: "40", value: "7.30 P.M" },
    { key: "41", value: "8.00 P.M" },
    { key: "42", value: "8.30 P.M" },
    { key: "43", value: "9.00 P.M" },
    { key: "44", value: "9.30 P.M" },
    { key: "45", value: "10.00 P.M" },
    { key: "46", value: "10.30 P.M" },
    { key: "47", value: "11.00 P.M" },
    { key: "48", value: "11.30 P.M" },
  ];

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    setImage(result?.assets[0].uri);
  };

  const onAddDoctor = async () => {
    const fileName = Date.now().toString() + ".jpg";
    const resp = await fetch(image);
    const blob = await resp.blob();

    const imageRef = ref(storage, "Doc-App/" + fileName);
    uploadBytes(imageRef, blob)
      .then((snapshot) => {
        console.log("File Uploaded...");
      })
      .then((resp) => {
        getDownloadURL(imageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          saveDoctorDetails(downloadUrl);
        });
      });
  };

  useEffect(() => {
    const fetchHospital = async () => {
      const hospitalQuery = query(
        collection(db, "HospitalList"),
        where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
      );
      const querySnapshot = await getDocs(hospitalQuery);
      if (!querySnapshot.empty) {
        setHospital(querySnapshot.docs[0].data().name);
      }
    };
    if (user) {
      fetchHospital();
    }
  }, []);

  const saveDoctorDetails = async (imageUrl) => {
    const hospitalQuery = query(
      collection(db, "HospitalList"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const hospitalSnapshot = await getDocs(hospitalQuery);
    if (!hospitalSnapshot.empty) {
      const hospitalDocRef = hospitalSnapshot.docs[0].ref; 
      const doctorCollectionRef = collection(hospitalDocRef, "DoctorList"); 

      await addDoc(doctorCollectionRef, {
        name: docName,
        specialization: specialization,
        hospital: hospital,
        exp: exp,
        description: description,
        times: selected,
        days: daySelected,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        imageUrl: imageUrl,
      });

      ToastAndroid.show("New doctor added...", ToastAndroid.LONG);
      setDocName(null);
      setSpecialization(null);
      setExp(null);
      setDescription(null);
      setSelected([]);
      setDaySelected([]);
      setImage(null);
    }
  };
  return (
    <ScrollView>
      <AddDoctorHeader />
      <View className="p-6">
        <Text className="font-[poppins-bold] text-lg">Add new doctor</Text>
        <Text className="font-[poppins-medium] text-lg text-gray-500 mt-[-6px]">
          Fill all details about doctor
        </Text>

        <TouchableOpacity onPress={() => onImagePick()} className="flex-row">
          {!image ? (
            <Image
              className="w-20 h-20 mt-4"
              source={require("../../assets/images/photo.png")}
            />
          ) : (
            <Image source={{ uri: image }} className="w-20 h-20 mt-4" />
          )}
          <Text className="font-[poppins-medium] text-lg mt-10 ml-2">
            Add doctor image
          </Text>
        </TouchableOpacity>

        <View>
          <TextInput
            placeholder="Enter full name"
            value={docName}
            onChangeText={(v) => setDocName(v)}
            placeholderTextColor="#C6C6C6"
            className="p-2 px-4 mt-2 text-[16px] bg-white border-2 border-gray-200 rounded-md "
          />
          <TextInput
            placeholder="Enter years of experience"
            value={exp}
            onChangeText={(v) => setExp(v)}
            keyboardType="numeric"
            placeholderTextColor="#C6C6C6"
            className="p-2 px-4 mt-2 text-[16px] bg-white border-2 border-gray-200 rounded-md "
          />
          <View className="mt-2 text-black bg-white border-2 border-gray-200 rounded-md text-md ">
            <RNPickerSelect
              style={{
                inputIOS: {
                  fontFamily: "poppins-medium",
                  fontSize: 17,
                  color: "black",
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingHorizontal: 12,
                },
                inputAndroid: {
                  fontFamily: "poppins-medium",
                  fontSize: 17,
                  color: "black",
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingHorizontal: 12,
                },
              }}
              onValueChange={(value) => setSpecialization(value)}
              value={specialization}
              placeholder={{
                label: "Select Specialization",
                value: null,
              }}
              items={[
                { label: "Cardiologist", value: "Cardiologist" },
                { label: "Dermatologist", value: "Dermatologist" },
                { label: "Endocrinologist", value: "Endocrinologist" },
                { label: "Gastroenterologist", value: "Gastroenterologist" },
                { label: "Oncologist", value: "Oncologist" },
                { label: "Pulmonologist", value: "Pulmonologist" },
                { label: "Nephrologist", value: "Nephrologist" },
                { label: "Otolaryngologist", value: "Otolaryngologist" },
              ]}
            />
          </View>

          <TextInput
            placeholder="Description"
            onChangeText={(v) => setDescription(v)}
            value={description}
            numberOfLines={3}
            placeholderTextColor="#C6C6C6"
            className="text-[16px] p-2 px-4 mt-2 bg-white border-2 border-gray-200 rounded-md "
          />

          <View className="mt-4">
            <Text className="mb-2 ml-4 font-[poppins-bold] text-md">
              Select Times
            </Text>
            <MultipleSelectList
              setSelected={(val) => setSelected(val)}
              data={data}
              label="Times"
              onSelect={() => console.log(selected)}
              save="value"
              fontFamily="poppins-medium"
              labelStyles={{ fontWeight: "900" }}
              badgeStyles={{ backgroundColor: Colors.PRIMARY }}
              checkBoxStyles={{ backgroundColor: "white" }}
            />
          </View>

          <View className="mt-4">
            <Text className="mb-2 ml-4 font-[poppins-bold] text-md">
              Select Dates
            </Text>
            <MultipleSelectList
              setSelected={(val) => setDaySelected(val)}
              data={day}
              label="Days"
              onSelect={() => console.log(daySelected)}
              save="value"
              fontFamily="poppins-medium"
              labelStyles={{ fontWeight: "900" }}
              badgeStyles={{ backgroundColor: Colors.PRIMARY }}
              checkBoxStyles={{ backgroundColor: "white" }}
            />
          </View>

          <TouchableOpacity onPress={() => onAddDoctor()}>
            <Text className="bg-[#607AFB] mt-4 p-3 text-white text-center rounded-lg font-[poppins-bold]">
              Add New Doctor
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default addDoctor;
