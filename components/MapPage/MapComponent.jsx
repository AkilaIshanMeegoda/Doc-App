import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { db } from "../../configs/FirebaseConfig"; // Import Firebase config
import { doc, getDoc } from "firebase/firestore";
import LottieView from "lottie-react-native";

const INITIAL_REGION = {
  latitude: 7.87,
  longitude: 80.77,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

// Function to parse coordinates from a Google Maps URL
const parseCoordinatesFromUrl = (url) => {
  const regex = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = url.match(regex);
  if (match) {
    return {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
    };
  }
  return null;
};

export default function MapComponent({ hospitalIds }) {
  const mapRef = useRef(null);
  const [hospitalMarkers, setHospitalMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalLocations = async () => {
      setLoading(true); // Start loading
      try {
        const fetchedHospitals = [];

        for (const hospitalId of hospitalIds) {
          console.log("Fetching hospital with ID:", hospitalId);
          const hospitalDocRef = doc(db, "HospitalList", hospitalId);
          const hospitalDoc = await getDoc(hospitalDocRef);

          if (hospitalDoc.exists()) {
            const data = hospitalDoc.data();
            console.log("Fetched document data:", data); // Log document data

            const coordinates = parseCoordinatesFromUrl(data.location); // Parse location coordinates
            console.log("Parsed coordinates:", coordinates); // Log parsed coordinates

            if (coordinates) {
              fetchedHospitals.push({
                id: hospitalId,
                name: data.name,
                coordinates,
              });
            } else {
              console.warn(
                "Could not parse coordinates from location:",
                data.location
              );
            }
          } else {
            console.warn(`No such hospital with ID: ${hospitalId}`);
          }
        }

        console.log("Fetched Hospitals:", fetchedHospitals); // Log fetched data
        setHospitalMarkers(fetchedHospitals);
      } catch (error) {
        console.error("Error fetching hospital locations:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (Array.isArray(hospitalIds) && hospitalIds.length > 0) {
      fetchHospitalLocations();
    } else if (hospitalIds === undefined || hospitalIds === null) {
      console.warn("No hospitalIds provided.");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [hospitalIds]);

  const onRegionChange = (region) => {
    console.log("Region changed:", region);
  };

  if (loading) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
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

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        onRegionChangeComplete={onRegionChange}
        ref={mapRef}
      >
        {hospitalMarkers.map((hospital) => {
          console.log("Rendering marker for:", hospital); // Log each marker
          return (
            <Marker
              key={hospital.id}
              coordinate={hospital.coordinates}
              title={hospital.name}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
