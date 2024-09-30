import { View, Text, Image, ScrollView, StyleSheet, Button } from "react-native";
import React, { useState, useEffect } from 'react';
import DoctorProfile from "../../components/HospitalProfile/DoctorProfile";
import HospitalProfile from "../../components/HospitalProfile/HospitalProfile";
import OptionComponent from "../../components/HospitalProfile/OptionComponent";
import { useLocalSearchParams } from "expo-router";
import { fetchDoctorsByFilter } from "../../utils/FetchDoctorsByFilter";
import { Rating } from "react-native-ratings";
import Toast from 'react-native-toast-message';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Use updateDoc and arrayUnion to allow adding multiple reviews
import { db } from "../../configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";

const hospital = () => {
  const { hospitalId, specialization, doctorName } = useLocalSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState(""); // Optional: Add review text
  const { user } = useUser(); // Retrieve user from hook

  // Fetch doctors when the component mounts or params change
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

  // Handle rating completion
  const ratingCompleted = (ratingValue) => {
    console.log("Rating is: " + ratingValue);
    setRating(ratingValue);
  };

  // Handle review submission
  // Handle review submission
const submitReview = async () => {
  console.log("Submitting review...");
  console.log("User object: ", user); // Log the user object to inspect its structure

  if (rating === 0) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Please provide a rating before submitting.',
      position: 'bottom',
    });
    return;
  }

  try {
    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddress || ""; // Safely access the email address

    if (!userEmail) {
      throw new Error("User email not found");
    }

    const reviewData = {
      userId: userEmail, // Use the correct email address
      rating: rating,
      reviewText: reviewText, // Optional: include text review
      createdAt: new Date(),
    };

    console.log("hi i did a review ", reviewData);

    // Store the review in Firestore under the "Hospital" collection
    const reviewDocRef = doc(db, "HospitalList", hospitalId);
    await updateDoc(reviewDocRef, {
      reviews: arrayUnion(reviewData),
    });

    Toast.show({
      type: 'success',
      text1: 'Review Added',
      text2: 'Your review has been added successfully!',
      position: 'bottom',
    });

    // Reset the rating and review text after submission
    setRating(0);
    setReviewText("");

  } catch (error) {
    console.error("Error adding review: ", error);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'There was a problem adding your review.',
      position: 'bottom',
    });
  }
};


  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        {/* Hospital Profile */}
        <HospitalProfile hospitalId={hospitalId} />
        
        {/* Doctors List */}
        <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: "row" }}>
          {doctors.map((doctor) => (
            <DoctorProfile key={doctor.id} doctor={doctor} />
          ))}
        </ScrollView>

        {/* Options Section */}
        <OptionComponent hospitalId={hospitalId} />

        {/* Review Section */}
        <View style={styles.reviewSection}>
          <Text style={styles.addAReview}>Add a Review</Text>
          <View style={styles.starsContainer}>
            <Rating
              showRating={false}
              onFinishRating={ratingCompleted}
              imageSize={24}
              ratingColor="#FFD700"
              ratingBackgroundColor="#e0e0e0"
              style={styles.ratingStyle}
              startingValue={rating}
            />
          </View>

          {/* Optional Text Input for Review Text */}
          {/* <View style={styles.textInputContainer}>
            <TextInput
              placeholder="Write a review"
              style={styles.reviewInput}
              value={reviewText}
              onChangeText={setReviewText}
            />
          </View> */}

          {/* Submit Button */}
          <Button title="Submit Review" onPress={submitReview} />

          {/* Toast Notification */}
          <Toast />
        </View>
      </View>
    </ScrollView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  addAReview: {
    fontFamily: "poppins-medium", 
    fontWeight: "500",
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  starsContainer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reviewSection: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  ratingStyle: {
    paddingVertical: 10,
  },
  textInputContainer: {
    marginVertical: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },
});

export default hospital;
