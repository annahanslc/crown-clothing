import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";

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
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, provider);

export const db = getFirestore();

////////////////////////////////////////////////////////////////////////////////

// Objective: upload data from js file into the firestore:
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log("done");
};
// the key is the name of the collection, such as "users" or "categories"
// because we are adding to an external source, this needs to be async
// collection(db, collectionKey) where db means "we are looking in the db" for the collection named "collectionKey"
// conception of transaction = successfull unit of work to a database, but 1 transaction can include multiple rights.
// make sure all of our objects are successfully added, that's when we use batch.

////////////////////////////////////////////////////////////////////////////////

// Objective: Get a Category Map:
export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, "categories");
  const q = query(collectionRef); // generate a query off of this collectionRef
  // this gives us an object that we can now get a snapshot from

  const querySnapshot = await getDocs(q); // getDoc fetches the snapshot that we want
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
};
// reduce this array in order to end up with an object
// acc is the accumulator, {} empty object is the starting value
// querySnapshot.docs will give us an array of all of those individual documents inside,
// and snapshots are the actual data inside

////////////////////////////////////////////////////////////////////////////////

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = { displayName: "" }
) => {
  if (!userAuth) return;

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
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  // if it does exist, just return userDocRef
  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return; // protect your code

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return; // protect your code

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
