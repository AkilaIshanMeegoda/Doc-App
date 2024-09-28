import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, StyleSheet, View, Text, Linking, ActivityIndicator, Share } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";

const Color = {
  colorBlack: "#000",
};

const Border = {
  br_3xs: 10,
};

const FontSize = {
  size_lg: 18,
  size_xs: 12,
  size_mini: 15,
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
    return <ActivityIndicator size="large" color={Color.colorBlack} />;
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
      <TouchableOpacity style={styles.iconContainer} onPress={() => handlePress(`tel:${hospitalData.contact}`)}>
        <Image
          style={styles.icon}
          contentFit="cover"
          source={require("../../assets/images/phonecall.png")}
        />
        <Text style={styles.label}>Phone</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => handlePress(`sms:${hospitalData.contact}`)}>
        <Image
          style={styles.icon}
          contentFit="cover"
          source={require("../../assets/images/message.png")}
        />
        <Text style={styles.label}>Message</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => handlePress(hospitalData.website)}>
        <Image
          style={styles.icon}
          contentFit="cover"
          source={require("../../assets/images/chrome.png")}
        />
        <Text style={styles.label}>Website</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={shareWebsite}>
        <Image
          style={styles.icon}
          contentFit="cover"
          source={require("../../assets/images/share.png")}
        />
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
  icon: {
    width: 45,
    height: 45,
    borderRadius: Border.br_3xs,
  },
  label: {
    marginTop: 5,
    fontSize: FontSize.size_xs,
    fontFamily: "poppins-medium",
    fontWeight: "500",
    color: Color.colorBlack,
    textAlign: "center",
  },
});

export default OptionComponent;
