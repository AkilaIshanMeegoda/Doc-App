import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./../../configs/FirebaseConfig"; // Import Firebase configuration
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { deleteDoc, doc } from "firebase/firestore"; // Import deleteDoc and doc


const documentManage = () => {
  const router = useRouter();
  const [images, setImages] = useState([]); // State to store uploaded image details
  const { user } = useUser(); // Clerk user hook
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null); // State for storing image URI

  useEffect(() => {
    fetchImagesFromFirestore(); // Fetch images on component mount
  }, []);

  // Function to handle picking images from gallery
  const pickImageFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Set image URI for further use
      setModalVisible(true); // Open modal for description input
    }
  };

  // Function to handle capturing images from the camera
  const captureImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setModalVisible(true);
    }
  };

  // Function to handle image upload to Firebase
  const uploadImageToFirebase = async () => {
    try {
      const email = user.primaryEmailAddress.emailAddress; // Get the user's email from Clerk

      // Create a unique filename and storage reference
      const fileName = `${email}_${new Date().getTime()}.jpg`;
      const storageRef = ref(storage, `images/${fileName}`);

      // Convert image to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Upload image to Firebase Storage
      await uploadBytes(storageRef, blob);

      // Get the image URL after upload
      const downloadURL = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      const docRef = await addDoc(collection(db, "Portal-Images"), {
        email,
        description,
        imageUrl: downloadURL,
        timestamp: new Date(), // Upload timestamp
      });

      console.log("Document written with ID: ", docRef.id);
      fetchImagesFromFirestore(); // Refresh image list after upload
      setModalVisible(false); // Close modal after upload
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  // Function to fetch images and metadata from Firestore
  const fetchImagesFromFirestore = async () => {
    try {
      const q = query(
        collection(db, "Portal-Images"),
        orderBy("timestamp", "desc")
      ); // Query ordered by timestamp
      const querySnapshot = await getDocs(q);
      const fetchedImages = [];
      querySnapshot.forEach((doc) => {
        fetchedImages.push({ id: doc.id, ...doc.data() });
      });
      setImages(fetchedImages); // Update state with retrieved images
    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  };


  // Function to delete an image document from Firestore
  const deleteImageFromFirestore = async (id) => {
    try {
      await deleteDoc(doc(db, "Portal-Images", id)); // Delete the document by ID
      fetchImagesFromFirestore(); // Refresh the image list after deletion
      alert("Document deleted successfully.");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete the document.");
    }
  };

  // Alert to choose between camera or gallery
  const handleImageUpload = () => {
    Alert.alert(
      "Upload Image",
      "Choose an option to upload an image",
      [
        {
          text: "Gallery",
          onPress: pickImageFromGallery,
        },
        {
          text: "Camera",
          onPress: captureImageFromCamera,
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: Colors.patientPortal.background,
      }}
    >
      <View style={{ marginVertical: 20, paddingHorizontal: 10, marginTop: 6 }}>
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            fontWeight: "bold",
            color: Colors.patientPortal.textPrimary,
          }}
        >
          Document Manager
        </Text>
        <Text style={{ fontSize: 16, textAlign: "center", lineHeight: 22 }}>
          View, upload images with descriptions.
        </Text>
      </View>
  
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.patientPortal.buttonBackground,
          padding: 15,
          marginBottom: 20,
          borderRadius: 10,
          elevation: 1,
          shadowColor: Colors.patientPortal.textSecondary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
        onPress={handleImageUpload}
      >
        <Feather name="upload" size={24} color={Colors.patientPortal.iconColor} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Upload Image</Text>
        </View>
      </TouchableOpacity>
  
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 20,
              color: "#333",
            }}
          >
            Your Documents
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {images.length > 0 ? (
              images.map((image) => (
                <View
                  key={image.id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 15,
                    width: "48%",
                    marginBottom: 20,
                    overflow: "hidden",
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                  }}
                >
                  {/* Image Section */}
                  <Image
                    source={{ uri: image.imageUrl }}
                    style={{
                      width: "100%",
                      height: 140,
                    }}
                  />
                  <View style={{ padding: 15 }}>
                    {/* Title */}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: 8,
                      }}
                    >
                      {image.description}
                    </Text>
                    {/* Upload Date */}
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#888",
                        marginBottom: 15,
                      }}
                    >
                      Uploaded on{" "}
                      {new Date(image.timestamp.seconds * 1000).toLocaleDateString()}
                    </Text>
                    {/* View Button */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.patientPortal.iconColor,
                        paddingVertical: 12,
                        alignItems: "center",
                        borderRadius: 8,
                        shadowColor: "#4CAF50",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "600",
                          fontSize: 14,
                        }}
                      >
                        View
                      </Text>
                    </TouchableOpacity>
                    {/* Cancel Icon for Deletion */}
                    <TouchableOpacity
                      onPress={() => deleteImageFromFirestore(image.id)}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                      }}
                    >
                      <Feather name="x" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: "#999", fontSize: 16 }}>
                No documents uploaded yet.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
  
      {/* Modal for Description Input */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: "80%",
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Enter Description
            </Text>
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={{
                borderWidth: 1,
                padding: 10,
                marginBottom: 20,
                borderRadius: 5,
              }}
            />
            <TouchableOpacity
              onPress={uploadImageToFirebase}
              style={{ backgroundColor: Colors.patientPortal.iconColor, padding: 10, borderRadius: 5 }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Upload
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 10, padding: 10 }}
            >
              <Text style={{ textAlign: "center", color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
  
};

export default documentManage;
