import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { db } from '../../configs/FirebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigation } from 'expo-router';
import { useUser } from "@clerk/clerk-expo"; // Import Clerk's useUser hook

// Import the notification scheduling functions
import { scheduleReminderNotification, requestNotificationPermissions, defineNotificationActions } from '../../utils/ReminderNotification';
import { scheduleReminderNotifications } from "../../utils/RemindNotificationPermission";

const ReminderDetails = () => {
  const [reminderName, setReminderName] = useState('');
  const [reminderNotes, setReminderNotes] = useState('');
  const [reminderTimes, setReminderTimes] = useState([null]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState({ show: false, index: null });
  const [loading, setLoading] = useState(false); // Loading state

  const { user } = useUser(); // Get the authenticated user information
  const navigation = useNavigation();

  // Screen navigation bar
  useEffect(() => {
    navigation.setOptions({
      title: `Medication Reminder`,
      headerTintColor: '#607AFB', 
      headerTitleStyle: {
        color: 'black', 
      },
    });
  }, [navigation]);

  const addMoreTime = () => {
    setReminderTimes([...reminderTimes, null]);
  };

  const handleDateChange = (event, selectedDate, setter) => {
    setter(selectedDate || new Date());
  };

  const handleTimeChange = (event, selectedTime, index) => {
    if (selectedTime) {
      const updatedTimes = [...reminderTimes];
      updatedTimes[index] = selectedTime;
      setReminderTimes(updatedTimes);
    }
    setShowTimePicker({ show: false, index: null });
  };

  // Function to add the reminder to Firestore
  const addReminder = async (reminderData) => {
    try {
      const docRef = await addDoc(collection(db, 'reminders'), {
        ...reminderData,
        userId: user.id, // Associate the reminder with the logged-in user
        createdAt: serverTimestamp(),
      });
      console.log('Reminder added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding reminder: ', error);
    }
  };

  // Validation function
  const validateForm = () => {
    if (!reminderName) {
      Alert.alert("Incomplete", "Please enter a reminder name.");
      return false;
    }
    if (!startDate) {
      Alert.alert("Incomplete", "Please select a starting date.");
      return false;
    }
    if (!endDate) {
      Alert.alert("Incomplete", "Please select an ending date.");
      return false;
    }
    if (reminderTimes.some(time => time === null)) {
      Alert.alert("Incomplete", "Please select a time.");
      return false;
    }
    return true;
  };

  // Function to handle setting the reminder and scheduling notifications
  const handleSetReminder = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    // Validate the form before proceeding
    if (!validateForm()) {
      return;
    }

    // Set loading to true while saving
    setLoading(true);

    try {
      // Check notification permissions
      const permissionGranted = await requestNotificationPermissions();
      if (!permissionGranted) {
        alert('Notification permissions are required for reminders.');
        return;
      }

      defineNotificationActions(); // Define the action button ('Okay') for the notification

      // Create reminder data object
      const reminderData = {
        reminderName,
        reminderNotes,
        startDate,
        endDate,
        reminderTimes,
      };

      // Save the reminder in Firestore
      await addReminder(reminderData);

      // Schedule notifications
      if (startDate && endDate && reminderTimes.length > 0) {
        const timeStrings = reminderTimes.map(time => time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Format times
        await scheduleReminderNotifications(startDate, endDate, reminderTimes, reminderName, reminderNotes); // Schedule notifications with the formatted times
      }

      // Navigate back after setting reminder
      navigation.goBack();
    } catch (error) {
      console.error("Error while setting reminder:", error);
    } finally {
      setLoading(false); // Set loading to false after saving
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Form Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Reminder Name"
        value={reminderName}
        onChangeText={setReminderName}
      />
      <TextInput
        style={styles.input}
        placeholder="Specific Notes for Reminder"
        value={reminderNotes}
        onChangeText={setReminderNotes}
      />

      {/* Start Date Picker */}
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePicker}>
        <Text style={startDate ? styles.selectedText : styles.placeholderText}>
          {startDate ? startDate.toDateString() : 'Starting Date'}
        </Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            handleDateChange(event, selectedDate, setStartDate);
          }}
        />
      )}

      {/* End Date Picker */}
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePicker}>
        <Text style={startDate ? styles.selectedText : styles.placeholderText}>
          {endDate ? endDate.toDateString() : 'Ending Date'}
        </Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            handleDateChange(event, selectedDate, setEndDate);
          }}
        />
      )}

      {/* Time Pickers */}
      {reminderTimes.map((time, index) => (
        <TouchableOpacity
          key={index}
          style={styles.timePicker}
          onPress={() => setShowTimePicker({ show: true, index })}
        >
          <Text style={startDate ? styles.selectedText : styles.placeholderText}>
            {time ? time.toLocaleTimeString() : 'Select Time'}
          </Text>
        </TouchableOpacity>
      ))}
      {showTimePicker.show && (
        <DateTimePicker
          value={reminderTimes[showTimePicker.index] || new Date()}
          mode="time"
          display="default"
          onChange={(event, selectedTime) =>
            handleTimeChange(event, selectedTime, showTimePicker.index)
          }
        />
      )}

      {/* Add More Time Button */}
      <TouchableOpacity onPress={addMoreTime} style={styles.addTimeButton}>
        <Feather name="plus" size={24} color={Colors.remind.fieldBackground} />
      </TouchableOpacity>

      {/* Show loading while saving */}
      {loading ? (
        <ActivityIndicator size="large" color="#607AFB" />
      ) : (
        <TouchableOpacity onPress={handleSetReminder} style={styles.setReminderButton}>
          <Text style={styles.setReminderButtonText}>Set Reminder</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 40,
    padding: 20,
    backgroundColor: Colors.remind.background,
  },
  input: {
    borderColor: Colors.remind.neutralColor,
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.remind.fieldBackground,
    fontSize: 16,
    color: '#000000',
  },
  selectedText: {
    color: '#000000',
  },
  placeholderText: {
    color: '#999999',
  },
  datePicker: {
    padding: 15,
    borderColor: Colors.remind.neutralColor,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: Colors.remind.fieldBackground,
    fontSize: 16,
  },
  timePicker: {
    padding: 15,
    borderColor: Colors.remind.neutralColor,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: Colors.remind.fieldBackground,
    fontSize: 16,
  },
  addTimeButton: {
    marginVertical: 10,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.PRIMARY,
  },
  setReminderButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  setReminderButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReminderDetails;