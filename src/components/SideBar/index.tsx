import React from "react";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";

interface SideBarProps {
  groupName: string;
}

export const SideBar: React.FC<SideBarProps> = ({ groupName }) => {
  const { users } = useLocation().state;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {groupName}
      </Typography>
      <p>Calendar Users</p>
      <Divider style={{ marginBottom: "15px", marginTop: "10px" }} />
      <List
        sx={{
          width: "100%",
          maxWidth: "360px",
          bgcolor: "background.paper",
          overflowX: "hidden",
        }}
      >
        {users &&
          users.map((email: string, index: number) => {
            return (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    minHeight: "32px", // or any other height value that suits your design
                    padding: "4px 16px", // reducing padding can also help in reducing the height
                  }}
                >
                  <ListItemAvatar>
                    <Avatar alt={email} src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        noWrap // This will prevent text wrapping
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis", // This will add ... for overflowing text
                        }}
                      >
                        {email}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            );
          })}
      </List>

      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      ></List>
    </>
  );
};
