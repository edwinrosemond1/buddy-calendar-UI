import React from "react";
import { Divider } from "@mui/material";

export const SideBar: React.FC = () => {
  return (
    <>
      {" "}
      <h3>Active Users</h3>{" "}
      <Divider style={{ marginBottom: "15px", marginTop: "10px" }} />
    </>
  );
};
