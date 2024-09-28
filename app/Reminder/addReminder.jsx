import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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

  const { user } = useUser(); // Get the authenticated user information
  const navigation = useNavigation();

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

  // Function to handle setting the reminder and scheduling notifications
  const handleSetReminder = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

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
      await scheduleReminderNotifications(startDate, endDate, reminderTimes, reminderName); // Schedule notifications with the formatted times
    }

    // Navigate back after setting reminder
    navigation.goBack(); 
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
        <Text>{startDate ? startDate.toDateString() : 'Starting Date'}</Text>
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
        <Text>{endDate ? endDate.toDateString() : 'Ending Date'}</Text>
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
          <Text>{time ? time.toLocaleTimeString() : 'Select Time'}</Text>
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
        <Feather name="plus" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>

      {/* Set Reminder Button */}
      <TouchableOpacity onPress={handleSetReminder} style={styles.setReminderButton}>
        <Text style={styles.setReminderButtonText}>Set Reminder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  datePicker: {
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
  },
  timePicker: {
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
  },
  addTimeButton: {
    marginVertical: 10,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 50,
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReminderDetails;
