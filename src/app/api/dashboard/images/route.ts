import { NextResponse } from "next/server";

import { getCurrentUser, getDashboardCapabilities, isLocalAdminSession } from "@/lib/auth";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import {
  buildDashboardImagePath,
  DASHBOARD_IMAGES_BUCKET,
  dashboardImageMimeTypes,
  type DashboardImageTarget,
  getDashboardImageValidationError,
  extractDashboardImagePathFromUrl,
  isDashboardImageTarget,
  isManagedDashboardImageUrl,
} from "@/lib/supabase/storage";
import { projectSlugSchema } from "@/lib/validators/project";

async function getImageMutationClient() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Debes iniciar sesion para gestionar imagenes." }, { status: 401 }),
    };
  }

  const { isLocalReadOnly } = await getDashboardCapabilities();

  if (isLocalReadOnly) {
    return {
      error: NextResponse.json(
        { error: "Anade SUPABASE_SERVICE_ROLE_KEY para subir o borrar imagenes reales." },
        { status: 403 },
      ),
    };
  }

  if (await isLocalAdminSession()) {
    return { client: createSupabaseAdminClient() };
  }

  return { client: await createSupabaseServerClient() };
}

export async function POST(request: Request) {
  const { client, error } = await getImageMutationClient();

  if (error || !client) {
    return error;
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const rawTarget = formData.get("target");
  const rawSlug = formData.get("slug");
  const slug = typeof rawSlug === "string" ? rawSlug.trim() : undefined;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Selecciona una imagen valida." }, { status: 400 });
  }

  if (typeof rawTarget !== "string" || !isDashboardImageTarget(rawTarget)) {
    return NextResponse.json({ error: "Destino de imagen no valido." }, { status: 400 });
  }

  const validationError = getDashboardImageValidationError(file);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (rawTarget === "project.cover") {
    const parsedSlug = projectSlugSchema.safeParse(slug);

    if (!parsedSlug.success) {
      return NextResponse.json(
        { error: "Guarda o completa primero un slug valido para la portada del proyecto." },
        { status: 400 },
      );
    }
  }

  const path = buildDashboardImagePath({
    target: rawTarget as DashboardImageTarget,
    contentType: file.type as (typeof dashboardImageMimeTypes)[number],
    slug,
  });

  const { error: uploadError } = await client.storage
    .from(DASHBOARD_IMAGES_BUCKET)
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `No se pudo subir la imagen. ${uploadError.message}` },
      { status: 500 },
    );
  }

  const { data } = client.storage.from(DASHBOARD_IMAGES_BUCKET).getPublicUrl(path);

  return NextResponse.json({
    publicUrl: data.publicUrl,
    path,
  });
}

export async function DELETE(request: Request) {
  const { client, error } = await getImageMutationClient();

  if (error || !client) {
    return error;
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud invalida." }, { status: 400 });
  }

  const url = typeof (payload as { url?: unknown })?.url === "string"
    ? (payload as { url: string }).url
    : "";

  if (!url) {
    return NextResponse.json({ error: "La URL de la imagen es obligatoria." }, { status: 400 });
  }

  if (!isManagedDashboardImageUrl(url)) {
    return NextResponse.json({ success: true });
  }

  const path = extractDashboardImagePathFromUrl(url);

  if (!path) {
    return NextResponse.json({ success: true });
  }

  const { error: deleteError } = await client.storage.from(DASHBOARD_IMAGES_BUCKET).remove([path]);

  if (deleteError) {
    return NextResponse.json(
      { error: `No se pudo borrar la imagen. ${deleteError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
