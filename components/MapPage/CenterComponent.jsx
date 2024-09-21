import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig"; // Import your centralized Firestore instance

const Color = {
    colorRoyalblue: "#4169e1",
    backgroundDefaultDefault: "#000",
    colorWhitesmoke_100: "#f5f5f5",
    colorGray_100: "#333",
  };
  const Border = {
    br_3xs: 10,
  };
  const FontSize = {
    bodyBase_size: 14,
    size_sm: 12,
    size_lg: 16,
  };

const CenterComponent = ({ hospitalId }) => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const hospitalRef = doc(db, 'HospitalList', hospitalId);
        const hospitalSnap = await getDoc(hospitalRef);

        if (hospitalSnap.exists()) {
          setHospital(hospitalSnap.data());
        } else {
          setError('Hospital not found');
        }
      } catch (err) {
        setError('Error fetching hospital data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [hospitalId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!hospital) {
    return <Text>No hospital data available</Text>;
  }

  return (
    <View style={styles.centerContainer}>
      <View style={styles.centerCard}>
        <Image
          style={styles.hospitalIcon}
          source={require("../../assets/images/maphospital.png")}
        />
        <View style={styles.centerDetails}>
          <Text style={styles.uploadDocument}>{hospital.name}</Text>
          <Text style={styles.mainStCityville}>{hospital.area}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Image
            style={styles.starIcon}
            source={require("../../assets/images/star1.png")}
          />
          <Text style={styles.ratingText}>4.5</Text>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
    centerContainer: {
      paddingBottom: 20,
    },
    centerCard: {
      flexDirection: "row",
      backgroundColor: Color.colorRoyalblue,
      borderRadius: Border.br_3xs,
      padding: 10,
      marginBottom: 10,
      alignItems: "center",
    },
    hospitalIcon: {
      width: 74,
      height: 74,
      marginRight: 15,
      borderRadius: Border.br_3xs,
    },
    centerDetails: {
      flex: 1,
    },
    mainStCityville: {
      fontFamily: 'poppins',
      fontSize: FontSize.size_sm,
      color: Color.colorWhitesmoke_100,
      marginTop: 20,
    },
    uploadDocument: {
      fontFamily: 'poppins-medium',
      fontSize: FontSize.bodyBase_size,
      color: Color.colorWhitesmoke_100,
      marginTop: -20,
    },
    ratingContainer: {
      flexDirection: "row",
      marginTop: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Color.colorWhitesmoke_100,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: Border.br_3xs,
    },
    starIcon: {
      width: 16,
      height: 16,
      marginRight: 5,
    },
    ratingText: {
      fontFamily: 'poppins-medium',
      fontSize: FontSize.size_sm,
      color: Color.colorGray_100,
    },
  });

export default CenterComponent