import React, { useContext, useEffect, useState } from "react";
import "./component.css";
import UserContext from "../../contexts/UserContext";
import { GroupCreationCard, ViewGroupCard } from "../Card";
import {
  collection,
  where,
  getDocs,
  query,
  setDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

export type Group = {
  name: string;
  id: string;
  author: string;
};

export const HomePage: React.FC = () => {
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const { user, claims } = useContext(UserContext);
  const groupsRef = collection(firestore, "groups"); // Reference to 'groups' collection
  const navigate = useNavigate();

  const handleViewCalendar = (groupId: string) => {
    console.log("passing groupid", groupId);
    navigate("/calendar", { state: groupId });
  };

  const handleCreateGroup = async (groupName: string) => {
    try {
      const groupQuery = query(groupsRef, where("name", "==", groupName));
      const querySnapshot = await getDocs(groupQuery);

      if (querySnapshot.empty) {
        const newGroup = {
          name: groupName,
          authorEmail: user?.email,
          authorUid: user?.uid,
          users: [user?.email],
        };
        await addDoc(groupsRef, newGroup); // Using addDoc to add a new document to the collection
        console.log("Group created:", newGroup);
      } else {
        console.log("Group with this name already exists");
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  useEffect(() => {
    if (user) {
      // Fetch groups from Firebase
      const fetchGroups = async () => {
        let groupsToSet: Group[] = [];
        const groupQuery = query(groupsRef);
        const querySnapshot = await getDocs(groupQuery);
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          groupsToSet.push({
            name: doc.data().name,
            id: doc.data().id,
            author: doc.data().authorEmail,
          });
        });
        // Logic to fetch user's groups from Firebase.
        // Replace the below dummy data with Firebase fetching logic

        setUserGroups(groupsToSet);
      };

      fetchGroups();
    }
  }, [user]);

  // const handleRequestAccess = () => {
  //   // Logic for requesting access to a group
  // };

  return (
    <div className="home-container">
      {userGroups.map((group) => (
        <ViewGroupCard
          groupName={group.name}
          groupId={group.id}
          author={group.author}
          handleViewCalendar={handleViewCalendar}
        />
      ))}
      {(claims?.admin as Boolean) === true ? (
        <GroupCreationCard handleCreateGroup={handleCreateGroup} />
      ) : (
        <></>
      )}
    </div>
  );
};
