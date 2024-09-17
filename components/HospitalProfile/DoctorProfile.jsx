import * as React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

const Color = {
  colorBlack: "#000",
  backgroundDefaultDefault: "#fff",
  colorRoyalblue: "#607afb",
  colorWhitesmoke_100: "#f5f5f5",
};

const Border = {
  br_3xs: 10,
  br_9xs: 4,
};

const FontSize = {
  size_lg: 18,
  size_mini: 15,
  size_xs: 12,
  bodyBase_size: 16,
};

const DoctorProfile = () => {

  const router = useRouter();

  const handleAppointmentPress = () => {
    router.push("/appointment"); // Adjust the route to your appointment page
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          style={styles.doctorImage}
          contentFit="cover"
          source={require("../../assets/images/doctorimage.png")}
        />
        <Text style={styles.doctorName}>Dr. Emily Johnson</Text>
        <Text style={styles.specialization}>Eye Specialist</Text>
        <View style={styles.ratingContainer}>
          <Image
            style={styles.starIcon}
            contentFit="cover"
            source={require("../../assets/images/star1.png")}
          />
          <Image
            style={styles.starIcon}
            contentFit="cover"
            source={require("../../assets/images/star1.png")}
          />
          <Image
            style={styles.starIcon}
            contentFit="cover"
            source={require("../../assets/images/star1.png")}
          />
          <Image
            style={styles.starIcon}
            contentFit="cover"
            source={require("../../assets/images/star1.png")}
          />
          <Image
            style={styles.starIcon}
            contentFit="cover"
            source={require("../../assets/images/star1.png")}
          />
        </View>
        <TouchableOpacity style={styles.appointmentButton} onPress={handleAppointmentPress}>
          <Text style={styles.appointmentText}>Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  card: {
    width: 160,
    backgroundColor: Color.backgroundDefaultDefault,
    borderRadius: Border.br_3xs,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  doctorImage: {
    height: 118,
    width: 157,
    borderRadius: Border.br_3xs,
    marginBottom: 10,
  },
  doctorName: {
    fontSize: FontSize.bodyBase_size,
    fontFamily: 'poppins-medium',
    color: Color.colorBlack,
    textAlign: "center",
  },
  specialization: {
    fontSize: FontSize.bodyBase_size,
    fontFamily: 'poppins-medium',
    color: Color.colorBlack,
    textAlign: "center",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  starIcon: {
    height: 20,
    width: 20,
    marginRight: 2,
  },
  appointmentButton: {
    height: 26,
    width: "100%",
    backgroundColor: Color.colorRoyalblue,
    borderRadius: Border.br_9xs,
    justifyContent: "center",
    alignItems: "center",
  },
  appointmentText: {
    fontSize: FontSize.size_xs,
    fontFamily: 'poppins-medium',
    fontWeight: "500",
    color: Color.colorWhite,
  },
});

export default DoctorProfile;
