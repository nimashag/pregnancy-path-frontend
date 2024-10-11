import * as Notifications from 'expo-notifications';


export const scheduleNotification = async (item: any, day: string) => {
  const trigger = new Date();
  trigger.setSeconds(trigger.getSeconds() + 10); 

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Reminder: Clinic ${day}`,
      body: `You have a clinic scheduled at ${item.time} at ${item.location}.`,
    },
    trigger: { seconds: 10 },
  });
};


export const askNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('You need to enable notifications for this app.');
  }
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });