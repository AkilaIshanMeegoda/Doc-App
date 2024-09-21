import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import React from 'react'
import DoctorProfile from "../../components/HospitalProfile/DoctorProfile";
import HospitalProfile from "../../components/HospitalProfile/HospitalProfile";
import OptionComponent from "../../components/HospitalProfile/OptionComponent";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { fetchDoctorsByFilter } from "../../utils/FetchDoctorsByFilter";


const hospital = () => {
  const { hospitalId, specialization, doctorName } = useLocalSearchParams();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const doctorsData = await fetchDoctorsByFilter({
        hospitalId,
        specialization,
        doctorName,
      });
      setDoctors(doctorsData);
    };
    fetchData();
  }, [hospitalId, specialization, doctorName]);

  const starIcons = [
    require("../../assets/images/star1.png"),
    require("../../assets/images/star1.png"),
    require("../../assets/images/star1.png"),
    require("../../assets/images/star1.png"),
    require("../../assets/images/star1.png"),
  ];

  console.log("doctors in hospital page", doctors);
  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <HospitalProfile />
        <ScrollView
          horizontal={true}
          contentContainerStyle={{ flexDirection: "row" }}
        >
          {doctors.map((doctor) => (
            <DoctorProfile key={doctor.id} doctor={doctor} />
          ))}
          {/* Add more DoctorProfile components as needed */}
        </ScrollView>
        <OptionComponent />
        
        <View style={styles.reviewSection}>
          <Text style={styles.addAReview}>Add a Review</Text>
          <View style={styles.starsContainer}>
            {starIcons.map((icon, index) => (
              <Image
                key={index}
                style={styles.starIcon}
                contentFit="cover"
                source={icon}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  addAReview: {
    fontFamily: "poppins-medium", // Adjust the font family if needed
    fontWeight: "500",
    fontSize: 14, // Adjust the font size if needed
    color: "#000", // Adjust the color if needed
    marginBottom: 8, // Space below the text
  },
  starIcon: {
    height: 20,
    width: 20,
    marginHorizontal: 2, // Space between stars
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0", // Gray background
    padding: 10, // Padding inside the container
    borderRadius: 10, // Rounded corners
    justifyContent: "center", // Center the stars horizontally
  },
  reviewSection: {
    marginTop: 10, // Space above the review section
    marginBottom: 20, // Space below the review section
    paddingHorizontal: 16, // Padding for the review section
  },
});

export default hospital