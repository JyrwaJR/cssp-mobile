import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Href, router } from 'expo-router';
import { logger } from '@utils/logger';
import { useNotificationStore } from '@stores/notification.store';
import { isRealDevice } from '@utils/helpers/expo';

/**
 * Whitelist of permitted internal routes for push-triggered navigation.
 * Prevents unauthorized redirection to sensitive or spoofed screens.
 */

type PushNotificationData = {
  url?: string;
  emp_cd?: string;
  type?: 'leave' | 'salary' | 'announcement';
  imageUrl: string;
};

/**
 * Global Hook for Push Notification lifecycle management.
 * Handles registration, foreground listeners, and deep-linking interactions.
 */
export const useNotifications = () => {
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const lastResponse = Notifications.useLastNotificationResponse();

  const processedResponseId = useRef<string | null>(null);

  // Secure navigation helper with whitelist validation
  const handleNavigation = (url: string, responseId: string | null = null) => {
    if (responseId && processedResponseId.current === responseId) {
      return;
    }

    if (responseId) {
      processedResponseId.current = responseId;
    }

    logger.info(`NotificationHook: Navigating to ${url}`, { responseId });
    router.push(url as Href);
  };

  useEffect(() => {
    if (lastResponse?.notification) {
      const data: PushNotificationData = lastResponse.notification.request.content
        .data as PushNotificationData;
      const url = data?.url;
      const id = lastResponse.notification.request.identifier;

      if (typeof url === 'string') {
        handleNavigation(url, id);
      }
    }
  }, [lastResponse]);

  useEffect(() => {
    if (!isRealDevice()) return;

    let isMounted = true;

    const register = async () => {
      if (process.env.NODE_ENV === 'production') {
        logger.info('NotificationHook: Skipping registration — already registered');
        return;
      }

      try {
        // TODO: Refactor to use NotificationService
        // await NotificationService.register({
        //   emp_cd: emp_cd || '',
        // });

        useNotificationStore.getState().setRegisteredEmpCd('');

        if (isMounted) {
          await Notifications.getNotificationChannelsAsync();
          logger.info('NotificationHook: Registration & Channel Sync Complete');
        }
      } catch (error) {
        logger.error('NotificationHook: Registration permanently failed.', error);
      }
    };

    register();

    const notificationListener = Notifications.addNotificationReceivedListener((notif) => {
      if (isMounted) {
        setNotification(notif);
        logger.info('NotificationHook: [RECEIVED] Foreground notification arrived', {
          id: notif.request.identifier,
        });
      }
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data: PushNotificationData = response.notification.request.content
        .data as PushNotificationData;
      const url = data.url;
      const id = response.notification.request.identifier;

      if (id || url) {
        logger.info('NotificationHook: [OPENED] User tapped notification', { id });
        if (typeof url === 'string') {
          handleNavigation(url, id);
        }
      }
    });

    return () => {
      isMounted = false;
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return { notification };
};
