import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './../../configs/FirebaseConfig';
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // Graph library
import { useUser } from '@clerk/clerk-expo';
import MetricsChart from "./../../components/Graphs/MetricsChart"; // Import HealthGraph component



const HealthGraph = () => {
  const [metrics, setMetrics] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      const email = user.primaryEmailAddress.emailAddress;
      const metricsCollection = collection(db, 'healthMetrics');
      const q = query(
        metricsCollection,
        where('email', '==', email),
        orderBy('submittedAt', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMetrics = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMetrics(fetchedMetrics);
      });

      // Cleanup the listener when component unmounts
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <View>
      {metrics.length > 0 ? (
        <MetricsChart metrics={metrics} />
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

export default HealthGraph;
