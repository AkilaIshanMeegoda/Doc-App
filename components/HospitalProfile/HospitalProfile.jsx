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
      <Text style={styles.hospitalName}>{hospitalData.name}</Text>
      <View style={styles.card}>
        {/* Image and Hospital Name */}
        <View style={styles.imageContainer}>
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

        {/* Details: Address and Contact */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.address}>{hospitalData.address}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Contact Number</Text>
            <Text style={styles.contactNumber}>{hospitalData.contact}</Text>
          </View>
        </View>

        {/* Star Rating aligned bottom-right with ash-colored frame */}
        <View style={styles.ratingContainer}>
          <View style={styles.ratingFrame}>
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
            <Text style={styles.ratingText}>{hospitalData.rating}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    width: "100%",
  },
  hospitalName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "left",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    padding: 10,
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000', // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  imageContainer: {
    marginRight: 10,
  },
  hospitalImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  detailsRow: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  address: {
    fontSize: 14,
    color: "#555",
  },
  contactNumber: {
    fontSize: 14,
    color: "#555",
  },
  ratingContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingFrame: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 10,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});

export default HospitalProfile;
