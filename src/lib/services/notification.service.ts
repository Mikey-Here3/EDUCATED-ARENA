import prisma from '@/lib/db';
import { PaginationParams, PaginatedResult, NotificationData } from '@/types';
import { NotificationType } from '@prisma/client';

export interface NotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  linkUrl?: string;
}

export async function createNotification(params: NotificationParams): Promise<void> {
  await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      data: params.data ?? undefined,
      linkUrl: params.linkUrl,
    },
  });
}

export async function getUserNotifications(
  userId: string,
  params: PaginationParams
): Promise<PaginatedResult<NotificationData>> {
  const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  const data: NotificationData[] = notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    linkUrl: n.linkUrl || undefined,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  }));

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export async function markAsRead(notificationId: string, userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllAsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function deleteNotification(notificationId: string, userId: string): Promise<void> {
  await prisma.notification.deleteMany({
    where: { id: notificationId, userId },
  });
}

export async function createBulkNotifications(
  userIds: string[],
  notification: Omit<NotificationParams, 'userId'>
): Promise<void> {
  const dataToInsert = userIds.map((userId) => ({
    userId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data ?? undefined,
    linkUrl: notification.linkUrl,
  }));

  await prisma.notification.createMany({
    data: dataToInsert,
  });
}
