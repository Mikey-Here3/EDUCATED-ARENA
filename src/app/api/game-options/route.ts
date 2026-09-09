import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/game-options
 * Returns categories with their valid formats, then optionally game modes filtered by categoryId+format,
 * and maps filtered by gameModeId.
 * 
 * Query params:
 *   - categoryId: filter game modes by category
 *   - format: further filter game modes by allowed format
 *   - gameModeId: filter maps by game mode
 */

// Category -> valid format mapping (authoritative source)
export const CATEGORY_FORMAT_MAP: Record<string, string[]> = {
  'mobile-esports': ['1v1', '2v2', '4v4'],
  'craftland-custom': ['1v1', '2v2', '3v3', '4v4', '5v5', '6v6'],
  'battle-royale': ['1v1', '2v2', '4v4', '20 Players', '32 Players', '48 Players'],
  'pc-emulator-league': ['1v1', '2v2', '4v4'],
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const format = searchParams.get('format');
    const gameModeId = searchParams.get('gameModeId');

    // 1. Always return categories
    const categories = await prisma.gameCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, slug: true, platform: true, description: true },
    });

    // 2. Compute valid formats for selected category
    let validFormats: string[] = [];
    if (categoryId) {
      const cat = categories.find((c) => c.id === categoryId);
      if (cat) {
        validFormats = CATEGORY_FORMAT_MAP[cat.slug] || [];
      }
    }

    // 3. Return game modes filtered by category + format (if provided)
    let gameModes: any[] = [];
    if (categoryId) {
      const allModes = await prisma.gameMode.findMany({
        where: { categoryId, isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true, slug: true, description: true, allowedFormats: true, allowedPlatforms: true },
      });

      // Filter modes to those that support the chosen format
      if (format) {
        gameModes = allModes.filter((m) => {
          const fmts = m.allowedFormats as string[];
          return Array.isArray(fmts) && fmts.includes(format);
        });
      } else {
        gameModes = allModes;
      }
    }

    // 4. Return maps filtered by game mode
    let maps: any[] = [];
    if (gameModeId) {
      const modeMaps = await prisma.gameModeMap.findMany({
        where: { gameModeId },
        include: { map: { select: { id: true, name: true, slug: true } } },
      });
      maps = modeMaps.map((mm) => mm.map);
    } else {
      // Fallback: return all active maps
      maps = await prisma.map.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true, slug: true },
      });
    }

    return NextResponse.json({
      categories,
      validFormats,
      gameModes,
      maps,
      categoryFormatMap: CATEGORY_FORMAT_MAP,
    });
  } catch (error: any) {
    console.error('Game options error:', error);
    return NextResponse.json({ error: 'Failed to fetch game options' }, { status: 500 });
  }
}
