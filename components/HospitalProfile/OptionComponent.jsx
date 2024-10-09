import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Linking,
  ActivityIndicator,
  Share,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import LottieView from "lottie-react-native";

const Color = {
  colorBlack: "#000",
};

const Border = {
  br_3xs: 10,
};

const FontSize = {
  size_lg: 18,
  size_xs: 12,
};

const OptionComponent = ({ hospitalId }) => {
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch hospital data from Firestore
  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const docRef = doc(db, "HospitalList", hospitalId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHospitalData(docSnap.data());
        } else {
          console.log("No such hospital!");
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
    return (
      <View style={{ alignItems: "center", paddingVertical: 32 }}>
        <LottieView
          loop
          autoPlay
          className="mt-32"
          source={require("../../assets/loading.json")} // Path to the local json file
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  if (!hospitalData) {
    return <Text>No hospital data available.</Text>;
  }

  const handlePress = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };

  const shareWebsite = async () => {
    try {
      await Share.share({
        message: `Check out the website of ${hospitalData.name}: ${hospitalData.website}`,
      });
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Phone Icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => handlePress(`tel:${hospitalData.contact}`)}
      >
        <View style={styles.iconWrapper}>
          <Feather name="phone" size={25} color="green" />
        </View>
        <Text style={styles.label}>Phone</Text>
      </TouchableOpacity>

      {/* Message Icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => handlePress(`sms:${hospitalData.contact}`)}
      >
        <View style={styles.iconWrapper}>
          <Feather name="mail" size={25} color="blue" />
        </View>
        <Text style={styles.label}>Message</Text>
      </TouchableOpacity>

      {/* Website Icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => handlePress(hospitalData.website)}
      >
        <View style={styles.iconWrapper}>
          <Feather name="globe" size={25} color="red" />
        </View>
        <Text style={styles.label}>Website</Text>
      </TouchableOpacity>

      {/* Share Icon */}
      <TouchableOpacity style={styles.iconContainer} onPress={shareWebsite}>
        <View style={styles.iconWrapper}>
          <Feather name="share-2" size={25} color="yellow" />
        </View>
        <Text style={styles.label}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconWrapper: {
    width: 55, // Width of the white card
    height: 55, // Height of the white card
    borderRadius: 15, // Rounded corners for the white card
    backgroundColor: "#fff", // White background for the icon card
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Offset for shadow
    shadowOpacity: 0.1, // Opacity of the shadow
    shadowRadius: 4, // Blur radius of the shadow
    elevation: 3, // Shadow for Android
  },
  label: {
    marginTop: 5,
    fontSize: FontSize.size_xs,
    fontWeight: "500",
    color: Color.colorBlack,
    textAlign: "center",
  },
});

export default OptionComponent;
