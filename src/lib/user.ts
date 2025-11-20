const KEY = "learnwai_user_id";

const genId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function getOrCreateUserId() {
  if (typeof window === "undefined") return undefined;

  let uid = localStorage.getItem(KEY);
  if (!uid) {
    uid = genId();
    localStorage.setItem(KEY, uid);
  }
  return uid;
}

export function setUserId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, id);
}
