const KEY = "learnwai_user_id";

export function getOrCreateUserId() {
  if (typeof window === "undefined") return undefined;
  let uid = localStorage.getItem(KEY);
  if (!uid) { uid = crypto.randomUUID(); localStorage.setItem(KEY, uid); }
  return uid;
}

export function setUserId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, id);
}
