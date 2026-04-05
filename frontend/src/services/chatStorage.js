import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const LOCAL_KEY = 'babyorbit_chats';

function getLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
}
function saveLocal(chats) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(chats));
}

export function saveChat(chatId, title, messages, userId) {
  const chat = { id: chatId, title, messages, updatedAt: Date.now() };
  if (userId) {
    const ref = doc(db, 'users', userId, 'chats', chatId);
    setDoc(ref, chat);
  }
  const chats = getLocal().filter(c => c.id !== chatId);
  chats.unshift(chat);
  saveLocal(chats);
}

export async function loadChats(userId) {
  if (userId) {
    try {
      const ref = collection(db, 'users', userId, 'chats');
      const snap = await getDocs(query(ref, orderBy('updatedAt', 'desc')));
      const chats = snap.docs.map(d => d.data());
      if (chats.length > 0) { saveLocal(chats); return chats; }
    } catch (e) { console.error('Firestore load failed, using local', e); }
  }
  return getLocal();
}

export async function deleteChat(chatId, userId) {
  if (userId) {
    try { await deleteDoc(doc(db, 'users', userId, 'chats', chatId)); } catch (e) { console.error(e); }
  }
  saveLocal(getLocal().filter(c => c.id !== chatId));
}
