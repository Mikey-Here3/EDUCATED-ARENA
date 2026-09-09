import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { uploadFile, validateFile } from '@/lib/services/file.service';
import prisma from '@/lib/db';
import { FileAssetType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as FileAssetType) || FileAssetType.PROFILE_IMAGE;
    const entityId = formData.get('entityId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate type enum
    if (!Object.values(FileAssetType).includes(type)) {
      return NextResponse.json({ error: 'Invalid file asset type' }, { status: 400 });
    }

    // Validate file size and type (5MB limit)
    const validation = await validateFile({
      size: file.size,
      type: file.type,
      name: file.name,
    }, {
      maxSize: 5 * 1024 * 1024,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Authorization checks based on asset type
    if (type === FileAssetType.TEAM_LOGO && entityId) {
      const team = await prisma.team.findUnique({ where: { id: entityId } });
      if (!team || (team.leaderId !== session.id && session.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Only the team leader can update team logo' }, { status: 403 });
      }
    }

    if (type === FileAssetType.GUILD_LOGO && entityId) {
      const guild = await prisma.guild.findUnique({ where: { id: entityId } });
      if (!guild || (guild.leaderId !== session.id && session.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Only the guild leader can update guild logo' }, { status: 403 });
      }
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file via file service (Cloudinary with local/S3 fallback)
    const uploadedAsset = await uploadFile(buffer, {
      type,
      uploadedById: session.id,
      originalName: file.name,
      mimeType: file.type,
      isPublic: type !== FileAssetType.MATCH_EVIDENCE && type !== FileAssetType.PAYMENT_SCREENSHOT,
    });

    // Automatically update User profile image if type is PROFILE_IMAGE
    if (type === FileAssetType.PROFILE_IMAGE) {
      await prisma.user.update({
        where: { id: session.id },
        data: { profileImageId: uploadedAsset.id },
      });
    }

    // Automatically update Team logo if entityId is provided
    if (type === FileAssetType.TEAM_LOGO && entityId) {
      await prisma.team.update({
        where: { id: entityId },
        data: { logoId: uploadedAsset.id },
      });
    }

    // Automatically update Guild logo if entityId is provided
    if (type === FileAssetType.GUILD_LOGO && entityId) {
      await prisma.guild.update({
        where: { id: entityId },
        data: { logoId: uploadedAsset.id },
      });
    }

    return NextResponse.json({
      success: true,
      fileAsset: {
        id: uploadedAsset.id,
        url: uploadedAsset.url,
        originalName: uploadedAsset.originalName,
        mimeType: uploadedAsset.mimeType,
        size: uploadedAsset.size,
      },
    });
  } catch (error: any) {
    console.error('File upload error:', error?.message);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
