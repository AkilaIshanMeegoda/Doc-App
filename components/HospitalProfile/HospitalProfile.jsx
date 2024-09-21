import * as React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

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

const HospitalProfile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Text style={styles.hospitalName}>Central Hospital</Text>
          <Image
            style={styles.hospitalImage}
            contentFit="cover"
            source={require("../../assets/images/hospital.png")}
          />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.address}>123 Main St, Cityville</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Contact Number:</Text>
            <Text style={styles.contactNumber}>0766839636</Text>
          </View>
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
    fontSize: FontSize.size_l,
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
