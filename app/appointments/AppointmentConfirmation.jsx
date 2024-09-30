import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AppointmentConfirmation = () => {
    const navigation = useNavigation();
  const { doctorName, hospitalName, appointmentDate, appointmentTime } = useLocalSearchParams();

  // Screen navigation bar
  useEffect(() => {
    navigation.setOptions({
      title: 'Make An Appointment',
      headerTintColor: '#607AFB',
      headerTitleStyle: {
        color: 'black',
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/confirmation.png')}
        style={styles.image}
      />
      <Text style={styles.thankYouText}>Thank You!</Text>
      <Text style={styles.confirmationText}>Your appointment has been confirmed.</Text>
      <View style={styles.appointmentDetails}>
        <Text style={styles.doctorName}>{doctorName}</Text>
        <Text style={styles.hospitalName}>{hospitalName}</Text>
        <Text style={styles.appointmentDate}>{appointmentDate}</Text>
        <Text style={styles.appointmentTime}>{appointmentTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  image: {
    width: 100,  // Adjust size as needed
    height: 100, // Adjust size as needed
    marginBottom: 20,
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#607AFB',
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  appointmentDetails: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    width: '100%',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hospitalName: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#777',
  },
});

export default AppointmentConfirmation;
