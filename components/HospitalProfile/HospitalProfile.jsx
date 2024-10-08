import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";

const HospitalProfile = ({ hospitalId }) => {
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const docRef = doc(db, "HospitalList", hospitalId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setHospitalData(data);

          const reviews = data.reviews || [];
          if (Array.isArray(reviews)) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
            setAverageRating(avgRating);
          }
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
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (!hospitalData) {
    return <Text>No hospital data available.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hospitalName}>{hospitalData.name}</Text>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.hospitalImage}
            source={
              hospitalData.image
                ? { uri: hospitalData.image }
                : require("../../assets/images/hospital.png")
            }
          />
        </View>

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

        <View style={styles.ratingContainer}>
          <View style={styles.ratingFrame}>
            <Image
              style={styles.starIcon}
              source={require("../../assets/images/star1.png")}
            />
            <Text style={styles.ratingText}>
              {averageRating !== undefined ? averageRating.toString() : "0.0"}
            </Text>
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
  },
  hospitalName: {
    fontSize: 20,
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
    elevation: 3,
    shadowColor: '#000',
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
