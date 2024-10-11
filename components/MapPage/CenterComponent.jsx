import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig"; // Import your centralized Firestore instance
import LottieView from "lottie-react-native";
import { Colors } from "../../constants/Colors";

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
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const hospitalRef = doc(db, "HospitalList", hospitalId);
        const hospitalSnap = await getDoc(hospitalRef);

        if (hospitalSnap.exists()) {
          const hospitalData = hospitalSnap.data();
          setHospital(hospitalData);

          // Calculate average rating and review count
          const reviews = hospitalData.reviews || [];

          if (Array.isArray(reviews)) {
            const totalRating = reviews.reduce(
              (acc, review) => acc + review.rating,
              0
            );
            const avgRating =
              reviews.length > 0
                ? (totalRating / reviews.length).toFixed(1)
                : 0;

            setAverageRating(avgRating);
            setReviewCount(reviews.length);
          }
        } else {
          setError("Hospital not found");
        }
      } catch (err) {
        setError("Error fetching hospital data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [hospitalId]);

  if (loading) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 32 }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!hospital) {
    return <Text>No hospital data available</Text>;
  }

  return (
    <View className="py-1 shadow-2xl">
      <View style={styles.centerCard}>
        <Image
          style={styles.hospitalIcon}
          source={require("../../assets/images/maphospital.png")}
        />
        <View style={styles.centerDetails}>
          <Text className="font-[poppins-bold] text-white">{hospital.name}</Text>
          <Text style={styles.mainStCityville}>{hospital.area}</Text>
        </View>

        {/* Rating and Review Count */}
        <View style={styles.ratingContainer}>
          <Image
            style={styles.starIcon}
            source={require("../../assets/images/star1.png")}
          />
          <Text style={styles.ratingText}>{averageRating}</Text>
          {/* <Text style={styles.reviewCount}>({reviewCount} reviews)</Text> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    paddingBottom: 20,
  },
  centerCard: {
    flexDirection: "row",
    backgroundColor: Colors.PRIMARY,
    borderRadius: Border.br_3xs,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Android Shadow
    elevation: 5,
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
    fontFamily: "poppins",
    fontSize: FontSize.size_sm,
    color: "white",
    marginTop: 20,
  },
  uploadDocument: {
    fontFamily: "poppins-bold",
    fontSize: 14,
    color: "black",
    marginTop: -20,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 45,
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
    fontFamily: "poppins-medium",
    fontSize: FontSize.size_sm,
    color: Color.colorGray_100,
  },
  reviewCount: {
    fontFamily: "poppins",
    fontSize: FontSize.size_sm,
    color: Color.colorGray_100,
    marginLeft: 5,
  },
});

export default CenterComponent;
