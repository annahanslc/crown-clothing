import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7pTFURaWcFLrB74jjpv-eTsVwurEk3yc",
  authDomain: "crown-clothing-db-5ed78.firebaseapp.com",
  projectId: "crown-clothing-db-5ed78",
  storageBucket: "crown-clothing-db-5ed78.appspot.com",
  messagingSenderId: "107471335940",
  appId: "1:107471335940:web:678429b264e6ce4d4dfb51",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider(); // create a new instance with GoogleAuthProvider class, which is provided by google authentication

provider.setCustomParameters({
  prompt: "select_account", // set your custom parameters. "select_account" just means they need to select the account
});

export const auth = getAuth(); // the auth is always the same, doesn't matter what you used to sign in
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  // if user data does not exist, set the document with the data from userAuth in my collection
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  // if it does exist, just return userDocRef
  return userDocRef;
};
