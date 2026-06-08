import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Intentar leer el body si es JSON
    let body: Record<string, string> = {};
    try {
      body = await request.json();
    } catch {
      // Ignorar si no hay body JSON
    }

    // 1. Obtener parámetros (priorizar body sobre query string)
    const secret = body.secret || request.nextUrl.searchParams.get('secret');
    const tag = body.tag || request.nextUrl.searchParams.get('tag');
    const path = body.path || request.nextUrl.searchParams.get('path');
    
    const expectedSecret = process.env.REVALIDATION_SECRET;
    
    if (!expectedSecret) {
      return NextResponse.json({ message: 'Error de configuración: REVALIDATION_SECRET no definido en el entorno' }, { status: 500 });
    }

    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Token de revalidación inválido' }, { status: 401 });
    }

    if (!tag && !path) {
      return NextResponse.json({ message: 'Se requiere el parámetro "tag" o "path"' }, { status: 400 });
    }

    // 3. Ejecutar la revalidación según el parámetro proporcionado
    if (tag) {
      // @ts-expect-error - Next.js 15+ exige el argumento 'profile' en los types pero la implementación acepta 1 argumento.
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, now: Date.now(), tag });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, now: Date.now(), path });
    }

  } catch (err) {
    return NextResponse.json({ message: 'Error revalidando', error: err }, { status: 500 });
  }
}


