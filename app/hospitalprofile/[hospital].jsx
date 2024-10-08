import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { fetchDoctorsByFilter } from "../../utils/FetchDoctorsByFilter";
import DoctorProfile from "../../components/HospitalProfile/DoctorProfile";
import HospitalProfile from "../../components/HospitalProfile/HospitalProfile";
import OptionComponent from "../../components/HospitalProfile/OptionComponent";
import { Rating } from "react-native-ratings";
import Toast from "react-native-toast-message";
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from '@expo/vector-icons'; // Importing Material Icons for delete button

const Hospital = () => {
  const { hospitalId, specialization, doctorName } = useLocalSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const { user } = useUser();
  const navigation = useNavigation();

  const userEmail =
    user?.primaryEmailAddress?.emailAddress || user?.emailAddress || "";

  useEffect(() => {
    const fetchData = async () => {
      const doctorsData = await fetchDoctorsByFilter({
        hospitalId,
        specialization,
        doctorName,
      });
      setDoctors(doctorsData);
      await fetchReviews();
    };
    fetchData();
  }, [hospitalId, specialization, doctorName]);

  useEffect(() => {
    navigation.setOptions({
      title: `Hospital Page`,
      headerTintColor: '#607AFB',
      headerTitleStyle: {
        color: 'black',
      },
    });
  }, [navigation]);

  const fetchReviews = async () => {
    try {
      const docRef = doc(db, "HospitalList", hospitalId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedReviews = docSnap.data().reviews || [];
        setReviews(fetchedReviews);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  };

  const ratingCompleted = (ratingValue) => {
    setRating(ratingValue);
  };

  const submitReview = async () => {
    if (rating === 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please provide a rating before submitting.",
        position: "bottom",
      });
      return;
    }

    try {
      if (!userEmail) {
        throw new Error("User email not found");
      }

      const reviewData = {
        userId: userEmail,
        rating: rating,
        reviewText: reviewText,
        createdAt: new Date(),
      };

      const reviewDocRef = doc(db, "HospitalList", hospitalId);
      await updateDoc(reviewDocRef, {
        reviews: arrayUnion(reviewData),
      });

      Toast.show({
        type: "success",
        text1: "Review Added",
        text2: "Your review has been added successfully!",
        position: "bottom",
      });

      setRating(0);
      setReviewText("");
      fetchReviews(); // Refresh reviews after adding
    } catch (error) {
      console.error("Error adding review: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "There was a problem adding your review.",
        position: "bottom",
      });
    }
  };

  const deleteReview = async (review) => {
    if (review.userId !== userEmail) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You can only delete your own reviews.",
        position: "bottom",
      });
      return;
    }

    const updatedReviews = reviews.filter(
      (r) => r.userId !== review.userId || r.createdAt !== review.createdAt
    );

    try {
      const reviewDocRef = doc(db, "HospitalList", hospitalId);
      await setDoc(reviewDocRef, { reviews: updatedReviews }, { merge: true });

      setReviews(updatedReviews); // Update state to reflect changes
      Toast.show({
        type: "success",
        text1: "Review Deleted",
        text2: "Your review has been deleted successfully!",
        position: "bottom",
      });
    } catch (error) {
      console.error("Error deleting review: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "There was a problem deleting your review.",
        position: "bottom",
      });
    }
  };

  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <HospitalProfile hospitalId={hospitalId} />
        <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: "row" }}>
          {doctors.map((doctor) => (
            <DoctorProfile key={doctor.id} doctor={doctor} hospitalId={hospitalId} />
          ))}
        </ScrollView>
        <OptionComponent hospitalId={hospitalId} />

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
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder="Write a review"
              style={styles.reviewInput}
              value={reviewText}
              onChangeText={setReviewText}
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsTitle}>All Reviews</Text>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUser}>{review.userId}</Text>
                    <Rating
                      readonly
                      startingValue={review.rating}
                      imageSize={20}
                      style={styles.ratingStyle}
                    />
                    {/* User-friendly delete button */}
                    {review.userId === userEmail && (
                      <TouchableOpacity onPress={() => deleteReview(review)}>
                        <MaterialIcons name="delete" size={24} color="#FF5252" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.reviewText}>{review.reviewText}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>No reviews yet.</Text>
            )}
          </View>

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
    paddingVertical: 2,
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
    borderRadius: 5,
    padding: 10,
    minHeight: 40,
  },
  submitButton: {
    backgroundColor: "#607AFB",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  reviewsContainer: {
    marginTop: 20,
  },
  reviewsTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  reviewItem: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewUser: {
    fontWeight: "bold",
    fontSize: 14,
  },
  reviewText: {
    marginTop: 5,
    fontSize: 12,
    color: "#555",
  },
  noReviewsText: {
    fontStyle: "italic",
    color: "#aaa",
  },
});

export default Hospital;
