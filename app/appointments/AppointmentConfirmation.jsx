import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AppointmentConfirmation = () => {
    const navigation = useNavigation();
    const { doctorName, doctorImg, specialization, hospitalName, appointmentDate, appointmentTime } = useLocalSearchParams();

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
                source={require('../../assets/images/confirmation.png')} // Adjust the path to the correct image path
                style={styles.image}
            />
            <Text style={styles.thankYouText}>Thank You!</Text>
            <Text style={styles.confirmationText}>Your appointment has been confirmed.</Text>
            <View style={styles.appointmentDetails}>
                <View style={styles.doctorInfo}>
                    <Image
                        style={styles.doctorImage}
                        source={{ uri: doctorImg }}
                    />
                    <View style={styles.doctorText}>
                        <Text style={styles.doctorName}>{doctorName}</Text>
                        <Text style={styles.specialization}>{specialization}</Text>
                        <Text style={styles.hospitalName}>{hospitalName}</Text>
                    </View>
                </View>
                <View style={styles.appointmentInfo}>
                    <Image 
                        source={require('../../assets/images/calender.webp')}
                        style={styles.calendarIcon}
                    />
                    <View style={styles.appointmentText}>
                        <Text style={styles.appointmentDate}>{appointmentDate}</Text>
                        <Text style={styles.appointmentTime}>{appointmentTime}</Text>
                    </View>
                </View>
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
        width: 180,
        height: 180,
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
        padding: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        width: '95%',
        alignItems: 'center',
    },
    doctorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    doctorImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 15,
    },
    doctorText: {
        alignItems: 'flex-start',
    },
    doctorName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    specialization: {
        fontSize: 14,
        color: '#777',
    },
    hospitalName: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    appointmentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    calendarIcon: {
        width: 35,
        height: 35,
        marginRight: 10,
    },
    appointmentText: {
        alignItems: 'flex-start',
    },
    appointmentDate: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    appointmentTime: {
        fontSize: 14,
        color: '#777',
    },
});

export default AppointmentConfirmation;