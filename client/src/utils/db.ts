import { openDB } from "idb";
import type { DBSchema } from "idb";

interface GyanoDB extends DBSchema {
  videos: {
    key: string;
    value: {
      id: string;
      blob: Blob;
    };
  };
}

const DB_NAME = "gyanoDB";

export const dbPromise = openDB<GyanoDB>(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("videos")) {
      db.createObjectStore("videos", { keyPath: "id" });
    }
  },
});