import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Function to ask for notification permissions
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === "granted";
  }
  return status === "granted";
};

// Function to define notification actions (e.g., the 'Okay' button)
export const defineNotificationActions = () => {
  if (Platform.OS === "ios") {
    Notifications.setNotificationCategoryAsync("reminder", [
      {
        identifier: "okay",
        buttonTitle: "Okay",
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
    ]);
  }
};

// Function to schedule a daily notification between start and end date
export async function scheduleReminderNotifications(
  startDate,
  endDate,
  times,
  reminderName
) {
  if (!(await requestNotificationPermissions())) {
    return;
  }

  // Convert times to 24-hour format
  const hoursAndMinutes = times.map((time) => ({
    hour: time.getHours(),
    minute: time.getMinutes(),
  }));

  // Set start and end dates as Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  while (start <= end) {
    for (let { hour, minute } of hoursAndMinutes) {
      const notificationTime = new Date(start);
      notificationTime.setHours(hour);
      notificationTime.setMinutes(minute);
      notificationTime.setSeconds(0);

      // Schedule notifications
      await Notifications.scheduleNotificationAsync({
        content: {
          title: reminderName,
          body: `It's time for your reminder!`,
          sound: true,
          actions: [{ title: "Okay", identifier: "okay" }],
        },
        trigger: {
          date: notificationTime,
          repeats: false, // Set to true if you want to repeat every day
        },
      });
    }

    // Move to the next day
    start.setDate(start.getDate() + 1);
  }
}

// Function to configure notification behavior (e.g., what happens when the user taps 'Okay')
export function configureNotificationBehavior() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  Notifications.addNotificationResponseReceivedListener((response) => {
    if (response.actionIdentifier === "okay") {
      // You can handle what happens when the user taps 'Okay' here
      console.log("Reminder acknowledged!");
    }
  });
}
