import React from 'react'
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import CenterComponent from "../../components/MapPage/CenterComponent";
import { useLocalSearchParams } from 'expo-router'

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

const mappage = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.mapMakerStandard}
        source={require("../../assets/images/map.png")}
      />

      <View style={styles.centerWrapper}>
        <Link href="/home/hospital">Push Settings</Link>
        <Text style={styles.availableCentres}>Available Centres</Text>

        {/* ScrollView added for available centers */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <CenterComponent />
          <CenterComponent />
        </ScrollView>
      </View>
    </View>
  )
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  settingsTitle: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
  },
  mapMakerStandard: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  centerWrapper: {
    marginTop: 20,
    flex: 1,
  },
  availableCentres: {
    fontSize: FontSize.size_lg,
    fontWeight: "700",
    fontFamily: 'poppins',
    color: Color.colorGray_100,
    textAlign: "center",
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
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
  },
  centerDetails: {
    flex: 1,
  },
  mainStCityville: {
    fontFamily: 'poppins',
    fontSize: FontSize.size_sm,
    color: Color.backgroundDefaultDefault,
  },
  uploadDocument: {
    fontFamily: 'poppins',
    fontSize: FontSize.bodyBase_size,
    color: Color.backgroundDefaultDefault,
    marginTop: 5,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starIcon: {
    width: 20,
    height: 20,
    marginLeft: 3,
  },
});

export default mappage