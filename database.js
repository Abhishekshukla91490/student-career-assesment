// All Firestore imports use the same Firebase version as firebase.js (v10.12.2)
import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  limit,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * Checks if a phone number already exists in the "students" collection.
 * Uses limit(1) query for performance.
 * @param {string} phone
 * @returns {Promise<boolean>} True if duplicate, false otherwise.
 */
export async function checkDuplicatePhone(phone) {
  try {
    const q = query(
      collection(db, "students"),
      where("phone", "==", phone),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking duplicate phone:", error);
    // Return false to allow the user to continue if database read fails
    return false;
  }
}

/**
 * Saves a student's career assessment details to the "students" collection.
 * @param {object} data - Assessment data payload (excluding server timestamp)
 * @returns {Promise<boolean>} Success (true) or Failure (false)
 */
export async function saveAssessment(data) {
  try {
    await addDoc(collection(db, "students"), {
      ...data,
      submittedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error saving assessment:", error);
    return false;
  }
}
