import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase-config";
import uuid from "react-uuid";
import UserContext from "../../contexts/UserContext";

interface CreateCard {
  setHasCreatedGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GroupCard {
  groupName: string;
  author: string;
  groupId: string;
  users: string[];
}

interface ViewCard extends GroupCard {
  handleViewCalendar: (
    groupId: string,
    groupName: string,
    users: string[]
  ) => void;
}

interface JoinCard extends GroupCard {
  handleJoinCalendar: (groupId: string) => void;
  isJoinLoading: boolean;
}

export const ViewGroupCard: React.FC<ViewCard> = ({
  groupName,
  author,
  groupId,
  users,
  handleViewCalendar,
}) => {
  return (
    <div key={groupName}>
      <Card
        sx={{
          minWidth: 250,
          minHeight: 250,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
            <span>{groupName} </span>
          </Typography>
          <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
            <span> Owner: {author} </span>
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => handleViewCalendar(groupId, groupName, users)}
          >
            View
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export const JoinGroupCard: React.FC<JoinCard> = ({
  groupName,
  author,
  groupId,
  users,
  handleJoinCalendar,
  isJoinLoading,
}) => {
  return (
    <div key={groupName}>
      <Card
        sx={{
          minWidth: 250,
          minHeight: 250,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
            <span>{groupName} </span>
          </Typography>
          <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
            <span> Owner: {author} </span>
          </Typography>
        </CardContent>
        <CardActions>
          {" "}
          {isJoinLoading ? (
            <CircularProgress />
          ) : (
            <Button size="small" onClick={() => handleJoinCalendar(groupId)}>
              Join
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
};

export const GroupCreationCard: React.FC<CreateCard> = ({
  setHasCreatedGroup,
}) => {
  const { user } = React.useContext(UserContext);

  const [isCreating, setIsCreating] = React.useState(false);
  const [isCreatingLoading, setIsCreatingLoading] = React.useState(false);
  const [invalidName, setInvalidName] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [groupNameErrorMessage, setGroupNameErrorMessage] = React.useState("");

  const startCreatingGroup = () => {
    setIsCreating(true);
  };

  const cancelCreatingGroup = () => {
    setInvalidName(false);
    setIsCreating(false);
    setGroupName("");
  };

  const submitGroup = async () => {
    const groupsRef = collection(firestore, "groups"); // Reference to 'groups' collection

    if (groupName.trim() === "") {
      // Handle empty group name case
      setGroupNameErrorMessage("Group name cannot be empty");
      return;
    }
    try {
      setIsCreatingLoading(true);
      const groupQuery = query(
        groupsRef,
        where("name", "==", groupName),
        where("author", "==", user?.email)
      );
      const querySnapshot = await getDocs(groupQuery);
      const id = uuid();
      if (querySnapshot.empty) {
        const newGroup = {
          name: groupName,
          author: user?.email,
          authorUid: user?.uid,
          users: [user?.email],
          id,
        };
        setDoc(doc(groupsRef, id), newGroup);
        // await addDoc(groupsRef, newGroup); // Using addDoc to add a new document to the collection
        setHasCreatedGroup(true);
        setIsCreating(false);
        setGroupName("");
      } else {
        setGroupNameErrorMessage("Group with this name already exists");
        setInvalidName(true);
      }
      setIsCreatingLoading(false);
    } catch (error) {
      console.error("Error creating group:", error);
    }

    // You might want to handle the promise rejection as well
  };

  return (
    <Card
      sx={{
        minWidth: 275,
        minHeight: 250,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardContent>
        {!isCreating ? (
          <>
            <Typography
              sx={{ fontSize: 24, marginBottom: 2, color: "#427DE3" }}
              color="text.secondary"
              gutterBottom
            >
              Create
            </Typography>
            <IconButton
              onClick={startCreatingGroup}
              style={{ color: "#427DE3" }}
            >
              <AddOutlinedIcon sx={{ fontSize: 50 }} />
            </IconButton>
          </>
        ) : (
          <TextField
            error={invalidName}
            helperText={groupNameErrorMessage}
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        )}
      </CardContent>
      {isCreating &&
        (isCreatingLoading ? (
          <CircularProgress />
        ) : (
          <CardActions>
            <Button variant="contained" color="primary" onClick={submitGroup}>
              Submit
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={cancelCreatingGroup}
            >
              Cancel
            </Button>
          </CardActions>
        ))}
    </Card>
  );
};
