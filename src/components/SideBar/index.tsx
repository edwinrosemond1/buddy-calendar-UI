import React from "react";
import { Divider } from "@mui/material";

interface SideBarProps {
  groupName: string;
}

export const SideBar: React.FC<SideBarProps> = ({ groupName }) => {
  return (
    <>
      <span>{groupName}</span>
      <h3>Active Users</h3>{" "}
      <Divider style={{ marginBottom: "15px", marginTop: "10px" }} />
    </>
  );
};
