import { dbPromise } from "../utils/db";

export const saveVideo = async (id: string, blob: Blob) => {
  const db = await dbPromise;
  await db.put("videos", { id, blob });
};

export const getVideo = async (id: string) => {
  const db = await dbPromise;
  return await db.get("videos", id);
};

export const deleteVideo = async (id: string) => {
  const db = await dbPromise;
  await db.delete("videos", id);
};