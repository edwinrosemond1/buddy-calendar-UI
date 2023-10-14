import React, { useContext, useEffect, useMemo, useState } from "react";
import "./component.css";
import UserContext from "../../contexts/UserContext";
import { GroupCreationCard, JoinGroupCard, ViewGroupCard } from "../Card";
import {
  collection,
  getDocs,
  query,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { RequestAccess } from "../Requests/RequestCard";
import { CircularProgress } from "@mui/material";

export type Group = {
  name: string;
  id: string;
  author: string;
  users: string[];
};

export const HomePage: React.FC = () => {
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [hasCreatedGroup, setHasCreatedGroup] = useState(false);
  const [hasJoinedGroup, setHasJoinedGroup] = useState(false);
  const [isJoinLoading, setIsJoinLoading] = useState(false);
  const [isGettingGroups, setIsGettingGroups] = useState(false);
  const { user, claims } = useContext(UserContext);
  const groupsRef = useMemo(() => collection(firestore, "groups"), []); // Reference to 'groups' collection

  const navigate = useNavigate();

  const handleViewCalendar = (
    groupId: string,
    groupName: string,
    users: string[]
  ) => {
    navigate("/calendar", { state: { groupId, groupName, users } });
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      setIsJoinLoading(true);
      const groupDocRef = doc(firestore, "groups", groupId);
      const docSnap = await getDoc(groupDocRef);
      if (docSnap.exists()) {
        const { users } = docSnap.data();
        users.push(user?.email);
        const documentForUpdate: Group = {
          ...(docSnap.data() as Group),
          users,
        };
        setDoc(doc(groupsRef, groupId), documentForUpdate);
        setHasJoinedGroup(!hasJoinedGroup);
      }
    } catch (err) {
      console.error("Error Joining", err);
    } finally {
      setIsJoinLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Fetch groups from Firebase
      const fetchGroups = async () => {
        setIsGettingGroups(true);
        let groupsToSet: Group[] = [];
        try {
          const groupQuery = query(groupsRef);
          const querySnapshot = await getDocs(groupQuery);
          querySnapshot.forEach((doc) => {
            groupsToSet.push({
              name: doc.data().name,
              id: doc.data().id,
              author: doc.data().author,
              users: doc.data().users.includes(user.email)
                ? doc.data().users
                : [],
            });
          });
          setUserGroups(groupsToSet);
        } catch (err) {
        } finally {
          setIsGettingGroups(false);
        }

        // Logic to fetch user's groups from Firebase.
        // Replace the below dummy data with Firebase fetching logic
      };

      fetchGroups();
    }
  }, [groupsRef, hasCreatedGroup, hasJoinedGroup, user]);

  // const handleRequestAccess = () => {
  //   // Logic for requesting access to a group
  // };

  return (
    <div className="home-container">
      {isGettingGroups ? (
        <CircularProgress />
      ) : (
        userGroups.map((group) =>
          group.users.includes(user?.email as string) ? (
            <ViewGroupCard
              groupName={group.name}
              groupId={group.id}
              author={group.author}
              users={group.users}
              handleViewCalendar={handleViewCalendar}
            />
          ) : (
            <JoinGroupCard
              groupName={group.name}
              groupId={group.id}
              author={group.author}
              users={group.users}
              handleJoinCalendar={handleJoinGroup}
              isJoinLoading={isJoinLoading}
            />
          )
        )
      )}

      {(claims?.admin as Boolean) === true ? (
        <GroupCreationCard setHasCreatedGroup={setHasCreatedGroup} />
      ) : (
        <></>
      )}
      <RequestAccess user={user} />
    </div>
  );
};
