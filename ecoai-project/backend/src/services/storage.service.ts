import { supabaseAdmin } from '../config/supabase.js';

export const PHOTO_BUCKET = 'planting-photos';

export async function uploadPhoto(
  userId: string,
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const path = `${userId}/${Date.now()}-${fileName}`;
  const { error } = await supabaseAdmin.storage
    .from(PHOTO_BUCKET)
    .upload(path, buffer, { contentType, upsert: false });
  if (error) throw error;

  const { data } = supabaseAdmin.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
