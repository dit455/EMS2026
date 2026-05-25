import { STORAGE_KEYS } from '../config/appConfig';

const fallbackNotifications = [
  {
    id: 'ems-board-approval',
    message: 'Board approval queue has 5 marks batches awaiting action.',
    type: 'info',
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: 'ems-schedule',
    message: 'May 2026 examination schedule draft is ready for review.',
    type: 'success',
    createdAt: new Date().toISOString(),
    read: false,
  },
];

function keyFor(userId) {
  return `${STORAGE_KEYS.notifications}:${userId || 'public'}`;
}

function readUserNotifications(userId) {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    localStorage.removeItem(keyFor(userId));
    return [];
  }
}

function writeUserNotifications(userId, notifications) {
  localStorage.setItem(keyFor(userId), JSON.stringify(notifications));
}

export function getPortalNotifications(userId, fallbackRead = false) {
  const saved = userId ? readUserNotifications(userId) : [];
  if (saved.length) return saved;
  return fallbackNotifications.map((item) => ({ ...item, read: fallbackRead || item.read }));
}

export function markAllPortalNotificationsRead(userId) {
  if (!userId) return;
  const nextNotifications = readUserNotifications(userId).map((item) => ({ ...item, read: true }));
  writeUserNotifications(userId, nextNotifications);
}

export function markPortalNotificationRead(userId, notificationId) {
  if (!userId) return;
  const nextNotifications = readUserNotifications(userId).map((item) => (
    item.id === notificationId ? { ...item, read: true } : item
  ));
  writeUserNotifications(userId, nextNotifications);
}
