import React from "react";
import { Image, TouchableOpacity, StyleSheet, View, Text, Linking } from "react-native";

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

const OptionComponent = () => {

  const phoneUrl = 'tel:+1234567890'; // Placeholder for phone URL
  const messageUrl = 'sms:+1234567890'; // Placeholder for message URL
  const websiteUrl = 'https://www.google.com'; // Open Google for checking purposes
  const shareUrl = 'https://www.google.com'; // Open Google for checking purposes

  const handlePress = async (url) => {
    try {
      // Open the URL or handle the action
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => handlePress(phoneUrl)}>
        <Image
          style={styles.icon}
          contentFit="cover"
          source={require("../../assets/images/phonecall.png")}
        />
        <Text style={styles.label}>Phone</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => handlePress(messageUrl)}>
        <Image
          style={styles.icon}
          contentFit="cover"
          source={require("../../assets/images/message.png")}
        />
        <Text style={styles.label}>Message</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => handlePress(websiteUrl)}>
        <Image
          style={styles.icon}
          contentFit="cover"
          source={require("../../assets/images/chrome.png")}
        />
        <Text style={styles.label}>Website</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => handlePress(shareUrl)}>
        <Image
          style={styles.icon}
          contentFit="cover"
          source={require("../../assets/images/share.png")}
        />
        <Text style={styles.label}>Share</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    width: 45,
    height: 45,
    borderRadius: Border.br_3xs,
  },
  label: {
    marginTop: 5,
    fontSize: FontSize.size_xs,
    fontFamily: 'poppins-medium',
    fontWeight: '500',
    color: Color.colorBlack,
    textAlign: 'center',
  },
});

export default OptionComponent