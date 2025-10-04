import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./../../.firebase";

export const loginWithGoogle = async (): Promise<{ idToken: string }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Lấy idToken từ Firebase
    const idToken = await result.user.getIdToken();

    return { idToken };
  } catch (error) {
    console.error("Google login failed:", error);
    throw error;
  }
};
