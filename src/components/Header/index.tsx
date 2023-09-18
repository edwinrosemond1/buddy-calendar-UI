import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import React, { useEffect, createContext } from "react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";

interface AppHeaderProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ setIsLoading }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  // useEffect(() => {
  //   setIsLoading(true); // Set loading to true initially

  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setIsAuthenticated(true);
  //       console.log("User is signed in:", user);
  //     } else {
  //       setIsAuthenticated(false);
  //       console.log("User is signed out.");
  //     }

  //     setIsLoading(false); // Set loading to false after authentication check is done
  //   });

  //   return () => unsubscribe(); // This ensures the observer is removed when the component is unmounted
  // }, [setIsAuthenticated, setIsLoading]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Buddy Calendar
        </Typography>
        <IconButton edge="end" color="inherit" onClick={handleOpen}>
          <AccountCircle />
        </IconButton>
        <Menu
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
