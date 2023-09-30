import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import React, { useContext } from "react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import UserContext from "../../contexts/UserContext";
import "./component.css";
import { useNavigate } from "react-router-dom";
import { ButtonBase } from "@mui/material";

interface AppHeaderProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ setIsLoading }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <ButtonBase onClick={() => navigate("/")}>
          <Typography variant="h6">Buddy Calendar</Typography>
        </ButtonBase>
        <div style={{ flexGrow: 1 }}></div>{" "}
        {/* This empty div will take up all available space, pushing your icon to the right */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: user?.color,
              marginRight: "8px", // Adjust the margin as needed
            }}
          ></div>
          <IconButton edge="end" color="inherit" onClick={handleOpen}>
            <div className="account-user">{user?.email}</div>
            <AccountCircle />
          </IconButton>
        </div>
        <Menu
          className="profile-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
