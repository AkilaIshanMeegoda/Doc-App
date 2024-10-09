import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  LogBox,
  StyleSheet,
} from "react-native";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import { Rating } from "react-native-ratings";

const Doctor = () => {
  const navigation = useNavigation();
  const { doctorId, userEmail, hospitalId } = useLocalSearchParams();
  const [doctor, setDoctor] = useState(null);
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState(""); // Optional: Add review text

  useEffect(() => {
    getDoctorById();
    console.log("Doctor ID from params:", doctorId);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: `Doctor Profile`,
      headerTintColor: "#607AFB",
      headerTitleStyle: {
        color: "black",
      },
    });
  }, [navigation, doctorId]);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const getDoctorById = async () => {
    const hospitalQuery = query(
      collection(db, "HospitalList"),
      where("userEmail", "==", userEmail)
    );
    const hospitalSnapshot = await getDocs(hospitalQuery);

    if (!hospitalSnapshot.empty) {
      const hospitalDocRef = hospitalSnapshot.docs[0].ref;

      const doctorDocRef = doc(hospitalDocRef, "DoctorList", doctorId);
      const doctorSnapshot = await getDoc(doctorDocRef);

      if (doctorSnapshot.exists()) {
        const doctorData = { id: doctorSnapshot.id, ...doctorSnapshot.data() };
        setDoctor(doctorData);
      } else {
        console.log("No doctor found with the given doctorId");
      }
    } else {
      console.log("No hospital found for the current user");
    }
  };

  const renderAppointmentItem = ({ item }) => (
    <View className="flex-row justify-between my-1">
      <Text className="font-[poppins-medium] text-[14px] w-24">{item.day}</Text>
      <FlatList
        data={item.times}
        horizontal
        keyExtractor={(time, index) => index.toString()}
        renderItem={({ item: time }) => (
          <Text className="text-white font-[poppins-medium] text-[14px] border border-blue-400 px-2 bg-[#607AFB] rounded-2xl mx-1">
            {time}
          </Text>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  const handleAppointment = () => {
    router.push({
      pathname: `/appointments/${doctor.id}`,
      params: { doctorId: doctor.id, userEmail: userEmail },
    });
  };

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
        type: "error",
        text1: "Error",
        text2: "Please provide a rating before submitting.",
        position: "bottom",
      });
      return;
    }

    try {
      const userEmail =
        user?.primaryEmailAddress?.emailAddress || user?.emailAddress || ""; // Safely access the email address

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
      const doctorDocRef = doc(
        db,
        "HospitalList",
        hospitalId,
        "DoctorList",
        doctorId
      );
      await updateDoc(doctorDocRef, {
        reviews: arrayUnion(reviewData),
      });

      Toast.show({
        type: "success",
        text1: "Review Added",
        text2: "Your review has been added successfully!",
        position: "bottom",
      });

      // Reset the rating and review text after submission
      setRating(0);
      setReviewText("");
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

  return (
    <ScrollView>
      {doctor ? (
        <View className="flex">
          <Image className="w-full h-64" source={{ uri: doctor?.imageUrl }} />
          <View className="h-full bg-gray-100 rounded-t-3xl mt-[-24px] p-8">
            <Text className="font-[poppins-bold] text-2xl">
              Dr. {doctor.name}
            </Text>
            <Text className="font-[poppins-bold] text-md mt-[-6px]">
              {doctor.hospital || "No Hospital Provided"}
            </Text>
            <Text className="font-[poppins-medium] text-md mt-[-6px] text-gray-500">
              {doctor.specialization}
            </Text>

            {/* Doctor's Information */}
            <View className="flex-row justify-between mt-6">
              <View className="flex-row">
                <MaterialIcons name="work" size={20} color="#0EE05B" />
                <Text className="font-[poppins-medium] text-[16px]">
                  {" "}
                  {doctor.exp || 0} years
                </Text>
              </View>
              <View className="flex-row">
                <MaterialIcons name="people" size={20} color="blue" />
                <Text className="font-[poppins-medium] text-[16px]">
                  {" "}
                  {Math.floor(Math.random() * 10) * 100 + 100}+
                </Text>
              </View>
              <View className="flex-row">
                <MaterialIcons name="star" size={20} color="#EBE100" />
                <Text className="font-[poppins-medium] text-[16px]">
                  {" "}
                  {doctor.rating || "4.5"}
                </Text>
              </View>
            </View>

            {/* Appointments Section */}
            <View>
              <Text className="font-[poppins-bold] text-[17px] mt-4">
                Appointments Available
              </Text>
              {doctor.days && doctor.times ? (
                <FlatList
                  data={doctor.days.map((day) => ({
                    day,
                    times: doctor.times,
                  }))}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderAppointmentItem}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <Text className="font-[poppins] text-[14px] text-gray-500">
                  No appointments available at this time.
                </Text>
              )}
            </View>

            {/* About Section */}
            <View>
              <Text className="font-[poppins-bold] text-[17px] mt-4">
                About
              </Text>
              <Text className="font-[poppins] text-[14px]">
                {doctor.description || "No description available."}
              </Text>
              <TouchableOpacity onPress={handleAppointment}>
                <Text className="bg-[#607AFB] mt-4 p-3 text-white text-center rounded-lg font-[poppins-bold]">
                  Make an appointment
                </Text>
              </TouchableOpacity>
            </View>

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

              {/* Submit Button */}
              <View style={styles.CenterSubmitButton}>
                <TouchableOpacity style={styles.Submitframe}>
                  <Text
                    style={[styles.SubmitText, styles.SubmitFlexBox]}
                    onPress={submitReview}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Toast Notification */}
              <Toast />
            </View>
          </View>
        </View>
      ) : (
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <LottieView
            loop
            autoPlay
            className="mt-32"
            source={require("../../assets/loading.json")} // Path to the local json file
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addAReview: {
    fontFamily: "poppins-medium",
    fontWeight: "500",
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    marginTop: -12,
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
  Submitframe: {
    borderRadius: 20,
    backgroundColor: "#4169e1",
    width: 100,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  SubmitFlexBox: {
    textAlign: "center",
    lineHeight: 24,
  },
  SubmitText: {
    fontSize: 16,
    fontFamily: "poppins",
    color: "#fff",
  },
  CenterSubmitButton: {
    alignItems: "center",
  },
});

export default Doctor;
