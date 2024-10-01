import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import { router } from 'expo-router';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import Feather from "@expo/vector-icons/Feather";

const Remind = () => {
  const [reminders, setReminders] = useState([]);
  const { user } = useUser(); // Clerk hook to get current user
  const userId = user?.id; // Get the user's ID

  useEffect(() => {
    if (userId) {
      const q = query(
        collection(db, 'reminders'),
        where('userId', '==', userId)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userReminders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReminders(userReminders);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  // Function to delete a reminder
  const handleDeleteReminder = (reminderId) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'reminders', reminderId));
            } catch (error) {
              console.error('Error deleting reminder: ', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/Reminder/addReminder")}
      >
        <Text style={styles.buttonText}>Add Reminder</Text>
      </TouchableOpacity>

      {reminders.length === 0 ? (
        // If no reminders are set, show the notice
        <View style={styles.reminderNoticeContainer}>
          <Text style={styles.reminderNotice}>
            No medication reminders {'\n'} have been set yet.
          </Text>
          <Text style={styles.reminderNotice}>
            You can set a reminder using {'\n'} the <Text style={{ fontWeight: 'bold' }}>'Add Reminder'</Text> button.
          </Text>
        </View>
      ) : (
        // If there are reminders, display them as cards
        <ScrollView contentContainerStyle={styles.reminderList}>
          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderCardContent}>
                <View>
                  <Text style={styles.reminderName}>{reminder.reminderName}</Text>
                  <Text style={styles.reminderDates}>
                    {formatReminderDates(reminder.startDate, reminder.endDate)}
                  </Text>
                  <Text style={styles.reminderDates}>
                    {formatReminderTimes(reminder.reminderTimes)}
                  </Text>
                  <Text style={styles.reminderNote}>{reminder.reminderNotes}</Text>
                </View>

                {/* Delete Icon */}
                <View>
                  <TouchableOpacity onPress={() => handleDeleteReminder(reminder.id)}>
                    <Feather name="trash" size={24} color={Colors.DANGER} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

// Helper function to format dates
const formatReminderDates = (startDate, endDate) => {
  const start = startDate ? new Date(startDate.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  const end = endDate ? new Date(endDate.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  return `${start} - ${end}`;
};

// Helper function to format times
const formatReminderTimes = (times) => {
  return times
    .filter((time) => time) // Filter out null times
    .map((time) => new Date(time.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
    .join(', ');
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: Colors.remind.background,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reminderNoticeContainer: {
    paddingTop: 50,
  },
  reminderNotice: {
    color: Colors.remind.textSecondary,
    textAlign: 'center',
    fontSize: 18,
    paddingTop: 20,
  },
  reminderList: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  reminderCard: {
    backgroundColor: Colors.remind.cardBackground,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.remind.neutralColor,
    marginBottom: 15,
    width: '90%',
    alignSelf: 'center',
  },
  reminderCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between text and icon
    alignItems: 'center',
    width: '100%',
  },
  reminderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 5,
  },
  reminderDates: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 3,
  },
  reminderNote: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 5,
  },
  deleteIcon: {
    paddingLeft: 10,
  },
});

export default Remind;
