import prisma from '@/lib/db';
import { PaginationParams, PaginatedResult } from '@/types';

interface AuditLogParams {
  actorId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  metadata?: unknown;
}

export async function logAudit(params: AuditLogParams): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      oldValue: params.oldValue ? JSON.parse(JSON.stringify(params.oldValue)) : undefined,
      newValue: params.newValue ? JSON.parse(JSON.stringify(params.newValue)) : undefined,
      ipAddress: params.ipAddress,
      metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
    }
  });
}

export async function getAuditLogs(
  params: PaginationParams & { actorId?: string; action?: string; targetType?: string }
): Promise<PaginatedResult<unknown>> {
  const { page, limit, sortBy = 'createdAt', sortOrder = 'desc', actorId, action, targetType } = params;
  const skip = (page - 1) * limit;

  const where = {
    ...(actorId && { actorId }),
    ...(action && { action }),
    ...(targetType && { targetType }),
  };

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: { actor: { select: { username: true, email: true } } }
    }),
    prisma.auditLog.count({ where })
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}
