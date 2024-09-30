import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text, ScrollView } from "react-native";
import { Colors } from "../../constants/Colors";

const MetricsChart = ({ metrics }) => {
  if (metrics.length < 2) {
    return (
      <View
        style={{ padding: 16, backgroundColor: "#ffffff", borderRadius: 12 }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            textAlign: "center",
            marginVertical: 10,
            color: "#333",
          }}
        >
          Not enough data to calculate percentage change.
        </Text>
      </View>
    );
  }

  // Extract blood pressure and diabetes level data, reversing the order
  const bloodPressureData = metrics
    .map((metric) => parseFloat(metric.bloodPressure))
    .reverse();
  const diabetesData = metrics
    .map((metric) => parseFloat(metric.diabetesLevel))
    .reverse();

  // Labels for X-axis, reversing the order
  const labels = metrics
    .map((metric) => {
      if (metric.submittedAt && metric.submittedAt.seconds) {
        const date = new Date(metric.submittedAt.seconds * 1000);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }
      return "";
    })
    .reverse();

  // Normal ranges
  const normalBloodPressure = [90, 120]; // Example: Normal range for systolic BP
  const normalDiabetesLevel = [70, 130]; // Example: Normal range for diabetes level

  // Get the last logged values from the reversed arrays
  const lastBloodPressure = bloodPressureData[0]; // Now the most recent is first
  const lastDiabetes = diabetesData[0]; // Now the most recent is first

  // Calculate percentage difference from normal range for blood pressure
  const bloodPressurePercentageDiff =
    lastBloodPressure < normalBloodPressure[0]
      ? ((lastBloodPressure - normalBloodPressure[0]) /
          normalBloodPressure[0]) *
        100 // Below normal
      : lastBloodPressure > normalBloodPressure[1]
      ? ((lastBloodPressure - normalBloodPressure[1]) /
          normalBloodPressure[1]) *
        100 // Above normal
      : 0; // Within normal range

  // Calculate percentage difference from normal range for diabetes
  const diabetesPercentageDiff =
    lastDiabetes < normalDiabetesLevel[0]
      ? ((lastDiabetes - normalDiabetesLevel[0]) / normalDiabetesLevel[0]) * 100 // Below normal
      : lastDiabetes > normalDiabetesLevel[1]
      ? ((lastDiabetes - normalDiabetesLevel[1]) / normalDiabetesLevel[1]) * 100 // Above normal
      : 0; // Within normal range

  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Display Percentage Difference for Blood Pressure */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          textAlign: "center",
          marginVertical: 10,
          color: "#333",
        }}
      >
        Blood Pressure
      </Text>
      <Text style={{ color: "#808080" }}>
        {" "}
        Current difference from Normal Range: {bloodPressurePercentageDiff.toFixed(2)}%
      </Text>
      {/* Blood Pressure Line Chart with Horizontal Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels,
            datasets: [{ data: bloodPressureData }],
          }}
          width={screenWidth * 1.5} // Adjust width for horizontal scrolling
          height={220}
          chartConfig={{
            backgroundColor: "#f8f8f8",
            backgroundGradientFrom: "#f8f8f8",
            backgroundGradientTo: "#f8f8f8",
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            strokeWidth: 3,
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 12 }}
        />
      </ScrollView>

      {/* Display Percentage Difference for Diabetes */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          textAlign: "center",
          marginVertical: 10,
          color: "#333",
        }}
      >
        Diabetes Level
      </Text>
      <Text style={{ color: "#808080" }}>
        Current difference from Normal Range: {diabetesPercentageDiff.toFixed(2)}%{" "}
      </Text>
      {/* Diabetes Level Line Chart with Horizontal Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels,
            datasets: [{ data: diabetesData }],
          }}
          width={screenWidth * 1.5} // Adjust width for horizontal scrolling
          height={220}
          chartConfig={{
            backgroundColor: "#f8f8f8",
            backgroundGradientFrom: "#f8f8f8",
            backgroundGradientTo: "#f8f8f8",
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            strokeWidth: 3,
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 12 }}
        />
      </ScrollView>
    </View>
  );
};

export default MetricsChart;
