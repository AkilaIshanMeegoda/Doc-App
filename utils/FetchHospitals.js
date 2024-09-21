// hospitalUtils.js
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../configs/FirebaseConfig"; // Import your db instance

export const fetchHospitals = async (area, name, specialization, hospitalName) => {
  try {
    console.log("Input Parameters", { area, hospitalName, specialization, name });

    let hospitalQuery = query(collection(db, 'HospitalList')); // Start with base collection
    const conditions = [];

    // Apply filters based on the input parameters
    if (area) {
      conditions.push(where('area', '==', area));
    }

    if (hospitalName) {
      conditions.push(where('name', '==', hospitalName));
    }

    if (specialization) {
      conditions.push(where('specialization', 'array-contains', specialization));
    }

    if (conditions.length > 0) {
      hospitalQuery = query(hospitalQuery, ...conditions);
      console.log("Conditions applied:", conditions);
    }

    const hospitalDocs = await getDocs(hospitalQuery);
    console.log("Hospital Docs", hospitalDocs);

    if (hospitalDocs.empty) {
      console.log("No matching hospitals found.");
      return [];
    }

    const hospitals = [];

    for (const doc of hospitalDocs.docs) {
      const hospitalData = doc.data();
      let hospital = { id: doc.id, name: hospitalData.name };

      // Filter by doctors if name is provided
      if (name) {
        const doctorQuery = query(collection(doc.ref, 'DoctorList'), where('name', '==', name));
        const doctorDocs = await getDocs(doctorQuery);

        if (doctorDocs.empty) {
          continue; // Skip hospitals that don't have the doctor
        } else {
          hospital.doctorInfo = doctorDocs.docs.map(doctorDoc => doctorDoc.data());
        }
      }

      hospitals.push(hospital);
    }

    console.log("Hospitals", hospitals);
    return hospitals;

  } catch (error) {
    console.error("Error fetching hospitals:", error);
    return [];
  }
};
