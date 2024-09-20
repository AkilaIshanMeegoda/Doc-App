import React from 'react'
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { collection, query, getDocs } from "firebase/firestore";

import { db } from "../../configs/FirebaseConfig";
const home = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [area, setArea] = useState("");

  const GetDetails = async () => {
    try {
      // Query the Hospital collection
      const q = query(collection(db, "HospitalList"));
      // console.log("q", q);
      const querySnapshot = await getDocs(q);
    // console.log("querySnapshot", querySnapshot);
      for (const hospitalDoc of querySnapshot.docs) {
        console.log("Hospital:", hospitalDoc.data());
    
        // Access the doctors subcollection
        const doctorsRef = collection(db, "HospitalList", hospitalDoc.id, "DoctorList");
        const doctorsSnapshot = await getDocs(doctorsRef);
    
        doctorsSnapshot.forEach((doctorDoc) => {
          console.log("Doctor:", doctorDoc.data());
        });
      }
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    GetDetails();
  }, []);

  const handleSearch = () => {
    router.push({
      // navigate to the mappage with the search parameters
      pathname: '/mappage/[settings]',
      params: {
        name,
        area,
        specialization,
        hospitalName
      }
    })
  }

  return (
    <View style={styles.container}>
    <Image
      style={styles.vnk44ui9ie1Icon}
      contentFit="cover"
      source={require("../../assets/images/home.png")}
    />
    <Text
      style={[styles.findTheBest, styles.findFlexBoxTop]}
    >{`Find the Best Doctors`}</Text>

    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: 240,
      }}
    >
      <View style={styles.input}>
      <TextInput 
        placeholder="Name of Doctor"
        value= {name}
        onChangeText={setName}
/>
      </View>
      <View style={styles.input}>
      <TextInput 
        placeholder="Specialization"
        value= {specialization}
        onChangeText={setSpecialization}
/>
      </View>
      <View style={styles.input}>
      <TextInput 
        placeholder="Doctor Center"
        value= {hospitalName}
        onChangeText={setHospitalName}
/>
      </View>
      <View style={styles.input}>
        <TextInput 
        placeholder="Area"
        value= {area}
        onChangeText={setArea}
/>
      </View>
    </View>

    <TouchableOpacity
    onPress={handleSearch}
     style={styles.frame}
  >
    <Text style={[styles.findMyDoctor, styles.findFlexBox]}>
      Find my Doctor
    </Text>
  </TouchableOpacity>
  </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  findFlexBoxTop: {
    textAlign: "center",
    lineHeight: 44,
    position: "absolute",
  },
  findFlexBox: {
    textAlign: "center",
    lineHeight: 24,
    position: "absolute",
  },
  vnk44ui9ie1Icon: {
    top: -2,
    left: -43,
    width: 469,
    height: 289,
    position: "absolute",
  },
  findTheBest: {
    top: 107,
    fontSize: 38,
    color: "#fff7f7",
    width: 360,
    height: 90,
    textAlign: "center",
  },
  input: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderColor: "#cccccc",
    borderWidth: 1,
    marginTop: 12,
    padding: 10,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  labelTypo: {
    fontFamily: "poppins",
    fontSize: 16,
    color: "#333",
  },
  findMyDoctor: {
    top: 12,
    left: 102,
    fontSize: 16,
    fontFamily: "poppins",
    color: "#fff",
  },
  frame: {
    top: 2,
    borderRadius: 6,
    backgroundColor: "#4169e1",
    width: 309,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  link: {
    marginTop: 30,
    fontSize: 18,
    color: "blue",
  },
});

export default home