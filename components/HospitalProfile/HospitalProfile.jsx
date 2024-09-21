import * as React from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore"; // Firestore imports
import { db } from "../../configs/FirebaseConfig"; // Import Firestore config

const Color = {
  colorBlack: "#000",
  backgroundDefaultDefault: "#fff",
};

const Border = {
  br_3xs: 10,
};

const FontSize = {
  size_lg: 18,
  size_mini: 15,
};

const HospitalProfile = ({ hospitalId }) => {
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch hospital data from Firestore
    const fetchHospitalData = async () => {
      try {
        const docRef = doc(db, "HospitalList", hospitalId); // Get the hospital doc by ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHospitalData(docSnap.data()); // Store the document data in state
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching hospital data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (hospitalId) {
      fetchHospitalData();
    }
  }, [hospitalId]);

  if (loading) {
    return <ActivityIndicator size="large" color={Color.colorBlack} />;
  }

  if (!hospitalData) {
    return <Text>No hospital data available.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Text style={styles.hospitalName}>{hospitalData.name}</Text>
          <Image
            style={styles.hospitalImage}
            contentFit="cover"
            source={
              hospitalData.image
                ? { uri: hospitalData.image }
                : require("../../assets/images/hospital.png")
            }
          />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.address}>{hospitalData.address}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Contact Number:</Text>
            <Text style={styles.contactNumber}>{hospitalData.contact}</Text>
          </View>
          <View style={styles.ratingContainer}>
            {Array(hospitalData.rating)
              .fill()
              .map((_, index) => (
                <Image
                  key={index}
                  style={styles.starIcon}
                  contentFit="cover"
                  source={require("../../assets/images/star1.png")}
                />
              ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: "100%", // Adjust width as needed
  },
  card: {
    flexDirection: "row",
    backgroundColor: Color.backgroundDefaultDefault,
    borderRadius: Border.br_3xs,
    overflow: "hidden",
    padding: 10,
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000', // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    alignItems: "center",
    marginRight: 10,
    flex: 1,
  },
  hospitalName: {
    fontSize: FontSize.size_lg,
    fontFamily: 'poppins-bold',
    fontWeight: "700",
    color: Color.colorBlack,
    marginBottom: 5,
    textAlign: 'center',
  },
  hospitalImage: {
    width: 100,
    height: 100,
    borderRadius: Border.br_3xs,
  },
  detailsContainer: {
    flex: 2,
    justifyContent: "center",
  },
  detailsRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: FontSize.size_mini,
    fontFamily: 'poppins-medium',
    fontWeight: "500",
    color: Color.colorBlack,
    marginBottom: 3,
  },
  address: {
    fontSize: FontSize.size_mini,
    fontFamily: 'poppins-medium',
    color: Color.colorBlack,
  },
  contactNumber: {
    fontSize: FontSize.size_mini,
    fontFamily: 'poppins-medium',
    color: Color.colorBlack,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
});

export default HospitalProfile;
