import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'scorecard-reminder' | 'booking-reminder' | 'roadmap-offer';
  title: string;
  message: string;
  cta?: {
    text: string;
    action: () => void;
  };
  dismissible: boolean;
  expiresAt?: Date;
}

export const useInAppNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    localStorage.setItem(`notification-dismissed-${id}`, 'true');
  };

  const checkScorecardCompletion = () => {
    const scorecardCompleted = localStorage.getItem('scorecard-completed');
    const hasBooked = localStorage.getItem('consultation-booked');
    const reminderDismissed = localStorage.getItem('notification-dismissed-scorecard-reminder');

    if (scorecardCompleted && !hasBooked && !reminderDismissed) {
      const completedDate = new Date(scorecardCompleted);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff >= 1) { // Show after 1 day
        addNotification({
          type: 'scorecard-reminder',
          title: 'Your Retirement Confidence Score™ is ready!',
          message: 'Complete your journey with a complimentary Family Office review.',
          cta: {
            text: 'Book Review',
            action: () => {
              window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
              localStorage.setItem('consultation-booked', 'true');
            }
          },
          dismissible: true,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
        });
      }
    }
  };

  useEffect(() => {
    checkScorecardCompletion();
    
    // Check every hour for new notifications
    const interval = setInterval(checkScorecardCompletion, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Remove expired notifications
  useEffect(() => {
    const now = new Date();
    setNotifications(prev => prev.filter(n => !n.expiresAt || n.expiresAt > now));
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification
  };
};