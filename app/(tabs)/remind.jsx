import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';

const Remind = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add Reminder</Text>
      </TouchableOpacity>
      <View style={styles.reminderNoticeContainer}>
        <Text style={styles.reminderNotice}>No medication reminders {'\n'} have been set yet.</Text>
        <Text style={styles.reminderNotice}>You can set a reminder using {'\n'} the <Text style={{fontWeight: 'bold'}}>'Add Reminder'</Text> button.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Aligns content to the top
    alignItems: 'center',          // Centers content horizontally
    paddingTop: 50,                // Adds some space from the top
    backgroundColor: Colors.remind.background
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
  },
  reminderNoticeContainer: {
    paddingTop: 50
  },
  reminderNotice: {
    color: Colors.remind.textSecondary,
    textAlign: 'center',
    fontSize: 18,
    paddingTop: 20
  }
});

export default Remind;
