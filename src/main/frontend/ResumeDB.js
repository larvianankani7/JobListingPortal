// IndexedDB helper for storing resume files safely

const DB_NAME = "ResumeDB";
const STORE_NAME = "resumes";

export const saveResumeToDB = (id, file) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(file, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject();
    };
  });
};

export const getResumeFromDB = (id) => {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, "readonly");
      const getReq = tx.objectStore(STORE_NAME).get(id);
      getReq.onsuccess = () => resolve(getReq.result);
    };
  });
};
