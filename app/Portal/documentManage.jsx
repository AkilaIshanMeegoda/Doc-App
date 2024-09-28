import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  Modal,
  ToastAndroid,
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
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./../../configs/FirebaseConfig";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { deleteDoc, doc } from "firebase/firestore";
import { useNavigation } from "expo-router";
import ImageViewer from "react-native-image-zoom-viewer";

const DocumentManage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [viewImageUri, setViewImageUri] = useState(null);

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      fetchImagesFromFirestore();
    }

    navigation.setOptions({
      title: "Document Management",
    });
  }, [user]);

  const pickImageFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setModalVisible(true);
    }
  };

  const captureImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
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

  const uploadImageToFirebase = async () => {
    try {
      const email = user.primaryEmailAddress.emailAddress;
      const fileName = `${email}_${new Date().getTime()}.jpg`;
      const storageRef = ref(storage, `images/${fileName}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "Portal-Images"), {
        email,
        description,
        imageUrl: downloadURL,
        timestamp: new Date(),
      });

      fetchImagesFromFirestore();
      setModalVisible(false);
      ToastAndroid.show("Document added successfully!", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const fetchImagesFromFirestore = async () => {
    try {
      const email = user.primaryEmailAddress.emailAddress;
      const q = query(
        collection(db, "Portal-Images"),
        orderBy("timestamp", "desc"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);
      const fetchedImages = [];
      querySnapshot.forEach((doc) => {
        fetchedImages.push({ id: doc.id, ...doc.data() });
      });
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  };

  const deleteImageFromFirestore = async (id) => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "Portal-Images", id));
              ToastAndroid.show(
                "Document deleted successfully!",
                ToastAndroid.SHORT
              );
              fetchImagesFromFirestore();
            } catch (error) {
              console.error("Error deleting document: ", error);
              ToastAndroid.show(
                "Failed to delete the document.",
                ToastAndroid.SHORT
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleImageUpload = () => {
    Alert.alert(
      "Upload Image",
      "Choose an option to upload an image",
      [
        { text: "Gallery", onPress: pickImageFromGallery },
        { text: "Camera", onPress: captureImageFromCamera },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const viewImage = (imageUrl) => {
    setViewImageUri(imageUrl);
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
          backgroundColor: Colors.PRIMARY,
          padding: 15,
          marginBottom: 20,
          borderRadius: 10,
          elevation: 1,
        }}
        onPress={handleImageUpload}
      >
        <Feather
          name="upload"
          size={24}
          color={Colors.patientPortal.buttonBackground}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color:Colors.patientPortal.buttonBackground }}>Upload Image</Text>
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
                    elevation: 3,
                  }}
                >
                  <Image
                    source={{ uri: image.imageUrl }}
                    style={{ width: "100%", height: 140 }}
                  />
                  <View style={{ padding: 15 }}>
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
                    <Text
                      style={{ fontSize: 13, color: "#888", marginBottom: 15 }}
                    >
                      Uploaded on{" "}
                      {new Date(
                        image.timestamp.seconds * 1000
                      ).toLocaleDateString()}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.patientPortal.iconColor,
                        paddingVertical: 12,
                        alignItems: "center",
                        borderRadius: 8,
                      }}
                      onPress={() => viewImage(image.imageUrl)}
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
                    <TouchableOpacity
                      onPress={() => deleteImageFromFirestore(image.id)}
                      style={{ position: "absolute", top: 10, right: 10 }}
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

      {/* Modal for Viewing Image */}
      <Modal
        visible={viewImageUri !== null}
        animationType="slide"
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
          {/* Close Button */}
          <TouchableOpacity
            style={{
              padding: 15,
              position: "absolute",
              top: 40,
              right: 20,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 5,
              zIndex: 1,
            }}
            onPress={() => setViewImageUri(null)}
          >
            <Text style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
              Close
            </Text>
          </TouchableOpacity>

          <ImageViewer
            imageUrls={[{ url: viewImageUri }]}
            enableSwipeDown
            onSwipeDown={() => setViewImageUri(null)}
            renderIndicator={() => null}
          />
        </View>
      </Modal>

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
              style={{
                backgroundColor: Colors.patientPortal.iconColor,
                padding: 10,
                borderRadius: 5,
              }}
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

export default DocumentManage;
