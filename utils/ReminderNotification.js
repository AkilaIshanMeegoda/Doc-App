import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

// Request permission for notifications
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Schedule the notification
export const scheduleReminderNotification = async (startDate, endDate, times) => {
  for (let time of times) {
    // Extract hours and minutes from time
    const [hour, minute] = time.split(':').map(Number);

    // Schedule daily notifications from startDate to endDate
    const currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      const triggerDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hour,
        minute
      );

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Medication Reminder",
          body: `It's time for your medication!`,
          data: { withSome: 'data' },
          sound: 'default',
          categoryIdentifier: 'medication-reminder', // For action buttons
        },
        trigger: triggerDate,
      });

      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
  }
};

// Define the stop action in notification
export const defineNotificationActions = () => {
  Notifications.setNotificationCategoryAsync('medication-reminder', [
    {
      identifier: 'stop',
      buttonTitle: 'Okay',
      options: { opensAppToForeground: false },
    },
  ]);
};

// Define the background task
TaskManager.defineTask('FETCH_REMINDER_TASK', async () => {
    try {
      // You can use this task to re-schedule notifications if needed
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
  
  // Register background task
  export const registerBackgroundTask = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    if (status !== BackgroundFetch.BackgroundFetchStatus.Available) {
      console.error('Background fetch not available');
      return;
    }
  
    await BackgroundFetch.registerTaskAsync('FETCH_REMINDER_TASK', {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  };
  