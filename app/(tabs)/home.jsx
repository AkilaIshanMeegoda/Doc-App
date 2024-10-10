import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";

const Home = () => {
  const router = useRouter();
  const navigation = useNavigation();
  // State variables
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState(null);
  const [hospitalName, setHospitalName] = useState(null);
  const [area, setArea] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [areas, setAreas] = useState([]);
  const [openSpecialization, setOpenSpecialization] = useState(false);
  const [openHospital, setOpenHospital] = useState(false);
  const [openArea, setOpenArea] = useState(false);

  const GetData = async () => {
    try {
      const q = query(collection(db, "HospitalList"));
      const querySnapshot = await getDocs(q);

      let allSpecializations = new Set();
      let allHospitals = new Set();
      let allAreas = new Set();

      querySnapshot.forEach((hospitalDoc) => {
        const hospitalData = hospitalDoc.data();
        console.log("Hospital Data:", hospitalData);

        // Collect specializations
        if (Array.isArray(hospitalData.specialization)) {
          hospitalData.specialization.forEach((spec) => {
            allSpecializations.add(spec);
          });
        }

        // Collect hospital names
        allHospitals.add(hospitalData.name);

        // Collect areas
        if (hospitalData.area) {
          allAreas.add(hospitalData.area);
        }
      });

      // Convert sets to arrays
      const specializationArray = [...allSpecializations].map((item) => ({
        label: item,
        value: item,
      }));
      const hospitalArray = [...allHospitals].map((item) => ({
        label: item,
        value: item,
      }));
      const areaArray = [...allAreas].map((item) => ({
        label: item,
        value: item,
      }));

      setSpecializations(specializationArray);
      setHospitals(hospitalArray);
      setAreas(areaArray);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  const handleSearch = () => {
    router.push({
      pathname: "/mappage/[settings]",
      params: {
        name,
        area,
        specialization,
        hospitalName,
      },
    });
  };

  useEffect(() => {
    navigation.setOptions({
      title: `Home`,
      headerTintColor: "#607AFB",
      headerTitleStyle: {
        color: "black",
      },
    });
  }, [navigation]);

  return (
    <View>
      <Image
        style={styles.vnk44ui9ie1Icon}
        contentFit="cover"
        source={require("../../assets/images/home.png")}
      />
      <Text style={[styles.findTheBest, styles.findFlexBoxTop]}>
        Find the Best Doctors
      </Text>

      <View className="p-4 py-12">
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name of Doctor"
            value={name}
            onChangeText={setName}
          />

          <DropDownPicker
            open={openSpecialization}
            value={specialization}
            items={specializations}
            setOpen={setOpenSpecialization}
            setValue={(callback) => {
              setSpecialization((prev) =>
                prev === callback() ? null : callback()
              );
            }}
            setItems={setSpecializations}
            placeholder="Select Specialization"
            containerStyle={{ width: "100%", marginTop: 12 }}
            zIndex={3000}
            zIndexInverse={1000}
          />

          <DropDownPicker
            open={openHospital}
            value={hospitalName}
            items={hospitals}
            setOpen={setOpenHospital}
            setValue={(callback) => {
              setHospitalName((prev) =>
                prev === callback() ? null : callback()
              );
            }}
            setItems={setHospitals}
            placeholder="Select Doctor Center"
            containerStyle={{ width: "100%", marginTop: 12 }}
            zIndex={2000}
            zIndexInverse={5000} // Ensures the hospital dropdown opens in front
          />

          <DropDownPicker
            open={openArea}
            value={area}
            items={areas}
            setOpen={setOpenArea}
            setValue={(callback) => {
              setArea((prev) => (prev === callback() ? null : callback()));
            }}
            setItems={setAreas}
            placeholder="Select Area"
            containerStyle={{ width: "100%", marginTop: 12 }}
            zIndex={1000}
            zIndexInverse={6000} // Higher inverse to ensure it opens in front
          />
        </View>
        <View className="items-center">
          <TouchableOpacity onPress={handleSearch} style={styles.frame}>
            <Text style={[styles.findMyDoctor, styles.findFlexBox]}>
              Find my Doctor
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles for the component
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
    top: 100, // Adjust position to avoid overlap
  },
  findFlexBox: {
    textAlign: "center",
    lineHeight: 24,
  },
  vnk44ui9ie1Icon: {
    top: -2,
    left: -43,
    width: 469,
    height: 289,
    position: "absolute",
  },
  findTheBest: {
    fontSize: 38,
    color: "#fff7f7",
    width: 360,
    height: 90,
    textAlign: "center",
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 240,
    width: "100%", // Ensure the form takes full width
    paddingHorizontal: 20, // Add horizontal padding
  },
  input: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderColor: "#cccccc",
    borderWidth: 1,
    marginTop: 12,
    padding: 10,
    width: "100%", // Use full width for input
  },
  findMyDoctor: {
    fontSize: 16,
    fontFamily: "poppins",
    color: "#fff",
  },
  frame: {
    borderRadius: 6,
    backgroundColor: "#4169e1",
    width: 290,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

export default Home;
