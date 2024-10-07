import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

const Color = {
  colorBlack: "#000",
  colorRoyalblue: "#607afb",
  colorWhite: "#fff",
  backgroundDefaultDefault: "#fff",
};

const Border = {
  br_3xs: 10,
  br_9xs: 4,
};

const FontSize = {
  size_lg: 18,
  size_mini: 14,
  size_xs: 12,
  bodyBase_size: 16,
};

const DoctorProfile = ({ doctor, hospitalId }) => {
  const router = useRouter();
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateAverageRating = () => {
      if (doctor.reviews && doctor.reviews.length > 0) {
        const totalRating = doctor.reviews.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = (totalRating / doctor.reviews.length).toFixed(1);
        setAverageRating(avgRating);
      } else {
        setAverageRating(0); // If there are no reviews, set average rating to 0
      }
      setLoading(false); // Set loading to false after calculations
    };

    calculateAverageRating();
  }, [doctor.reviews]);

  const handleAppointmentPress = () => {
    router.push(`/doctor/${doctor.id}?userEmail=${doctor.userEmail}&hospitalId=${hospitalId}`);
    console.log(doctor.id, doctor.userEmail, hospitalId);
  };

  // Show a loading indicator while fetching data
  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <View style={styles.card}>
      {/* Doctor Image */}
      <Image
        style={styles.doctorImage}
        source={{ uri: doctor.imageUrl }}
      />

      {/* Doctor Name and Specialization */}
      <View style={styles.textContainer}>
        <Text style={styles.doctorName}>
          {doctor.name || "Dr. David Johnson"}
        </Text>
        <View style={styles.specializationButton}>
          <Text style={styles.specialization}>
            {doctor.specialization || "Heart Surgeon"}
          </Text>
        </View>
      </View>

      {/* Appointment Button and Rating */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.appointmentButton}
          onPress={handleAppointmentPress}
        >
          <Text style={styles.appointmentText}>Appointment</Text>
        </TouchableOpacity>
        <View style={styles.ratingFrame}>
          <Image
            style={styles.starIcon}
            source={require("../../assets/images/star1.png")}
          />
          <Text style={styles.ratingText}>
            {averageRating !== undefined ? averageRating : "0.0"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180, // Reduced width
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 8, // Reduced padding
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 8, // Reduced margin
    marginHorizontal: 8, // Reduced margin
  },
  doctorImage: {
    width: 140, // Reduced image width
    height: 120, // Reduced image height
    borderRadius: 12, // Kept the same
    marginBottom: 5,
  },
  textContainer: {
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 10, // Adjusted padding
  },
  doctorName: {
    fontSize: 16, // Reduced font size
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
  },
  specialization: {
    fontSize: 13, // Reduced font size
    color: "#7d7d7d",
    textAlign: "left",
    marginVertical: 4, // Slightly reduced vertical margin
  },
  specializationButton: {
    backgroundColor: "#dfdfdf",
    borderRadius: 30,
    paddingVertical: 2, // Reduced vertical padding
    paddingHorizontal: 5, // Reduced horizontal padding
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12, // Reduced margin at the top
    width: "100%",
  },
  appointmentButton: {
    backgroundColor: "#5271FF",
    borderRadius: 30,
    paddingVertical: 6, // Reduced vertical padding
    paddingHorizontal: 12, // Reduced horizontal padding
  },
  appointmentText: {
    color: "#fff",
    fontSize: 12, // Reduced font size
    fontWeight: "bold",
  },
  ratingFrame: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingVertical: 4, // Reduced padding
    paddingHorizontal: 8, // Reduced padding
    borderRadius: 12, // Reduced border-radius
  },
  starIcon: {
    width: 18, // Reduced icon size
    height: 18,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12, // Reduced font size
    color: "#000",
    fontWeight: "bold",
  },
});

export default DoctorProfile;
