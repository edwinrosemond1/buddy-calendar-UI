import React, { useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, ParsedToken, User } from "firebase/auth";
import { ref, onValue, off } from "firebase/database";
import { auth, database, firestore } from "../firebase-config";
import UserContext, { CalendarUser } from "./UserContext";
import { doc, getDoc } from "firebase/firestore";

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CalendarUser | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [claims, setClaims] = useState<ParsedToken | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      console.log("running, setting user");
      setUser(currentUser as CalendarUser);
      setLoading(false);

      let metadataRef;
      let callback;

      // Remove previous listener.
      if (callback && metadataRef) {
        off(metadataRef, "value", callback);
      }

      if (currentUser) {
        console.log("currentUser id", currentUser.uid);
        currentUser.getIdTokenResult().then((idTokenResult) => {
          console.log("token", idTokenResult);
          setClaims(idTokenResult.claims);
        });
        const userRef = doc(firestore, "users", currentUser.uid); // Reference to the user document
        console.log("getting ref", userRef);
        const userDoc = await getDoc(userRef); // Get the document
        console.log("user doc", userDoc);
        if (userDoc.exists()) {
          setUser({
            ...currentUser,
            color: userDoc.data().color,
          } as CalendarUser); // Set the user color state
        }

        metadataRef = ref(
          database,
          "metadata/" + currentUser.uid + "/refreshTime"
        );

        callback = (_snapshot: any) => {
          console.log("claims change");
          currentUser.getIdTokenResult(true).then((idTokenResult) => {
            setClaims(idTokenResult.claims);
          });
        };

        onValue(metadataRef, callback);
      } else {
        setClaims(undefined);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, claims, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
