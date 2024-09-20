import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text } from "react-native";

const MetricsChart = ({ metrics }) => {
  // Extract blood pressure and diabetes level from metrics
  const bloodPressureData = metrics.map((metric) =>
    parseFloat(metric.bloodPressure)
  );
  const diabetesData = metrics.map((metric) =>
    parseFloat(metric.diabetesLevel)
  );

  // Check if submittedAt exists and convert to readable format, otherwise return an empty string
  const labels = metrics.map((metric) => {
    if (metric.submittedAt && metric.submittedAt.seconds) {
        const date = new Date(metric.submittedAt.seconds * 1000); // Convert Firestore timestamp
        return `${date.getDate()}/${date.getMonth() + 1}`; // Format as day/month
      } else {
        return ''; // Fallback for missing timestamps
      }
  });

  const screenWidth = Dimensions.get("window").width;

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
        Blood Pressure Trends
      </Text>
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: bloodPressureData,
              color: () => `rgba(255, 0, 0, 0.5)`, // Color for blood pressure line
            },
          ],
        }}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 2,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
        Diabetes Level Trends
      </Text>
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: diabetesData,
              color: () => `rgba(0, 0, 255, 0.5)`, // Color for diabetes level line
            },
          ],
        }}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 2,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  );
};

export default MetricsChart;
