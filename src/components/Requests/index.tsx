import { collection, getDocs, query } from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";
import { firestore } from "../../firebase-config";
import UserContext from "../../contexts/UserContext";
import React from "react";
import { RequestCard } from "./RequestCard";

export interface Request {
  author: string;
  id: string;
  status: string;
  permission: string[];
  dateSubmitted: Date;
}

export const ViewRequests = () => {
  const requestsRef = useMemo(() => collection(firestore, "requests"), []); // Reference to 'groups' collection
  const { user } = useContext(UserContext);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  useEffect(() => {
    if (user) {
      // Fetch groups from Firebase
      const fetchRequests = async () => {
        let requestsToSet: Request[] = [];
        const requestQuery = query(requestsRef);
        const querySnapshot = await getDocs(requestQuery);
        querySnapshot.forEach((doc) => {
          console.log(doc);
          requestsToSet.push({
            author: doc.data().author,
            status: doc.data().status,
            id: doc.data().id,
            dateSubmitted: new Date(doc.data().dateTime.toDate()),
            permission: doc.data().permission,
          });
        });
        // Logic to fetch user's groups from Firebase.
        // Replace the below dummy data with Firebase fetching logic

        setPendingRequests(requestsToSet);
      };

      fetchRequests();
    }
  }, [requestsRef, user]);
  return (
    <div className="home-container">
      {pendingRequests.map((request) => (
        <RequestCard
          author={request.author}
          status={request.status}
          dateTime={request.dateSubmitted}
          permission={request.permission}
          requestingUser={user}
          id={request.id}
        />
      ))}
    </div>
  );
};
