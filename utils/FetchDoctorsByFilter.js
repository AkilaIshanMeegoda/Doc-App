import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../configs/FirebaseConfig"; // Import your db instance

export const fetchDoctorsByFilter = async ({ hospitalId, specialization, doctorName }) => {
    console.log("Input Parameters in fetchDoctorsByFilter", { hospitalId, specialization, doctorName });

    try {
        // Ensure hospitalId is provided
        if (!hospitalId) {
            throw new Error("Hospital ID is required.");
        }

        // Create a reference to the Doctor subcollection for the specified hospital
        const doctorsCollectionRef = collection(db, 'HospitalList', hospitalId, 'DoctorList');
        console.log("Doctors Collection Reference:", doctorsCollectionRef);

        // Apply only specialization filter on Firestore query
        let doctorQuery = query(doctorsCollectionRef);

        if (specialization) {
            doctorQuery = query(doctorsCollectionRef, where('specialization', '==', specialization));
        }

        // Fetch all doctors from Firestore
        const doctorSnapshot = await getDocs(doctorQuery);

        if (doctorSnapshot.empty) {
            console.log("No doctors found that match the criteria.");
            return [];
        }

        // Map the documents to doctor objects
        let doctors = doctorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // If doctorName is provided, filter doctors client-side
        if (doctorName) {
            doctors = doctors.filter(doctor => 
                doctor.name.toLowerCase().includes(doctorName.toLowerCase())
            );
        }

        console.log("Filtered Doctors:", doctors);
        return doctors;

    } catch (error) {
        console.error('Error fetching doctors:', error);
        return [];
    }
};

