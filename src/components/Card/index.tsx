import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { IconButton, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface CreateCard {
  handleCreateGroup: (groupName: string) => Promise<void>;
}

interface ViewCard {
  groupName: string;
  author: string;
  groupId: string;
  handleViewCalendar: (groupId: string) => void;
}

export const ViewGroupCard: React.FC<ViewCard> = ({
  groupName,
  author,
  groupId,
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
          <Button size="small" onClick={() => handleViewCalendar(groupId)}>
            View
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export const GroupCreationCard: React.FC<CreateCard> = ({
  handleCreateGroup,
}) => {
  const [isCreating, setIsCreating] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");

  const startCreatingGroup = () => {
    setIsCreating(true);
  };

  const cancelCreatingGroup = () => {
    setIsCreating(false);
    setGroupName("");
  };

  const submitGroup = async () => {
    if (groupName.trim() === "") {
      // Handle empty group name case
      console.log("Group name cannot be empty");
      return;
    }

    await handleCreateGroup(groupName); // assuming this function is asynchronous
    // You might want to handle the promise rejection as well
    setIsCreating(false);
    setGroupName("");
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
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        )}
      </CardContent>
      {isCreating && (
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
      )}
    </Card>
  );
};

// import React from 'react';
// import { Card, CardContent, Typography, IconButton } from '@mui/material';
// import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
// import UserContext from './path-to-UserContext'; // Replace with your actual path

// export const ActionCard: React.FC<BasicCardProps> = ({ content }) => {
//   const { claims } = React.useContext(UserContext);

//   return (
//     <div key={content}>
//       <Card sx={{ minWidth: 275, minHeight: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//         <CardContent>
//           <Typography sx={{ fontSize: 24, marginBottom: 2 }} color="text.secondary" gutterBottom>
//             {content}
//           </Typography>
//           <IconButton onClick={() => { console.log("clicked"); }} size="large">
//             <AddOutlinedIcon sx={{ fontSize: 50 }} />
//           </IconButton>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
