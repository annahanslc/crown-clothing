import { createContext, useEffect, useState } from "react";
import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener,
} from "../utils/firebase/firebase.utils";

export const UserContext = createContext({
  currentUser: null, // the context needs an initial state as well
  setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // we want to store a user object, so let's use useState hook
  const value = { currentUser, setCurrentUser }; // save the 2 values that we need

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user);
    });

    return unsubscribe; // useEffect will return when it unmounts, so when it unmounts, we remove the listener
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 1 storage thing - the literal context, the actual value you want to access
// 2 the provider - the component, receive children and return Context.Provider
// every context has a provider, the provider is what wraps around any other components that need access to the values in side
// name the Context and Provider according to what it is for
// the provider needs to receive the value, so it can hold the actual values
