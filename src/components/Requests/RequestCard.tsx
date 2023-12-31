import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  LockOpenTwoTone,
  CheckCircleOutlined,
  Face4TwoTone,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState, useContext } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import uuid from "react-uuid";
import { firestore } from "../../firebase-config";
import UserContext, { CalendarUser } from "../../contexts/UserContext";
import { Request } from "./index";
import { CLOUD_FUNCTION_DOMAIN } from "../../env/env-var";

interface RequestCardProps {
  author: string;
  permission: string[];
  dateTime: Date;
  status: string;
  requestingUser: CalendarUser | undefined;
  id: string;
  refresh?: boolean;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  author,
  permission,
  dateTime,
  status,
  requestingUser,
  id,
  setRefresh,
  refresh,
}) => {
  const { token } = useContext(UserContext);
  console.log(token);
  const enableAdminURL = (CLOUD_FUNCTION_DOMAIN + "/enableAdmin") as string;
  const [isApproving, setIsApproving] = useState(false);
  useEffect(() => {}, [isApproving]);

  const handleApprove = async () => {
    console.log("running approve");
    setIsApproving(true);
    try {
      // hit endpoint
      const body = JSON.stringify({
        email: requestingUser?.email,
      });
      console.log(body);
      const response = await fetch(enableAdminURL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body,
      });

      // Handle response
      const responseData = await response.json();
      console.log("success", responseData);
      if (responseData) {
        const requestDocRef = doc(firestore, "requests", id);
        const docSnap = await getDoc(requestDocRef);
        console.log("docSnap", docSnap);
        if (docSnap.exists()) {
          const requestForUpdate: Request = {
            ...(docSnap.data() as Request),
            status: "Approved",
          };
          setDoc(requestDocRef, requestForUpdate);
        }
      }
    } catch (err) {
      console.error("error on setting claim", err);
    } finally {
      setIsApproving(false);
      setRefresh!(!refresh);
    }
  };

  return (
    <Card
      sx={{
        minWidth: 250,
        minHeight: 250,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Face4TwoTone sx={{ fontSize: 50 }} />
      <CardContent sx={{ padding: "8px" }}>
        <Typography gutterBottom variant="h5" component="div">
          Status: {status}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {author}
        </Typography>
        <span>Permissions:</span>
        {permission.map((p) => (
          <Typography gutterBottom variant="body2" component="div">
            {p}
          </Typography>
        ))}
      </CardContent>
      <CardActions>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleApprove()}
            disabled={isApproving}
          >
            Approve
          </Button>

          {isApproving && (
            <CircularProgress
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
              size={24}
            />
          )}
        </div>
        <Button size="small">{dateTime.toLocaleDateString()}</Button>
      </CardActions>
    </Card>
  );
};

interface RequestAccessProps {
  user: CalendarUser | undefined;
}

export const RequestAccess: React.FC<RequestAccessProps> = ({ user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);
  const requestsRef = useMemo(() => collection(firestore, "requests"), []); // Reference to 'groups' collection

  useEffect(() => {
    const getRequests = async () => {
      const requestQuery = query(
        requestsRef,
        where("author", "==", user?.email)
      );
      const querySnapshot = await getDocs(requestQuery);
      if (!querySnapshot.empty) {
        setHasRequest(true);
      }
    };
    getRequests();
  }, [isSubmitting]);

  const submitRequest = async () => {
    // build request
    const requestRef = collection(firestore, "requests"); // Reference to 'groups' collection

    try {
      setIsSubmitting(true);
      const id = uuid();
      const newRequest = {
        author: user?.email as string,
        authorUid: user?.uid,
        id,
        permission: ["admin"],
        dateTime: new Date(),
        status: "Pending",
      };
      await setDoc(doc(requestRef, id), newRequest);
      // await addDoc(groupsRef, newGroup); // Using addDoc to add a new document to the collection
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          minWidth: 250,
          minHeight: 250,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center", // This helps to center the text within the CardContent
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center", // Center the text within CardContent
          }}
        >
          <Typography
            sx={{ fontSize: 24, marginBottom: 2, color: "#427DE3" }}
            color="text.secondary"
            gutterBottom
          >
            Request Access
          </Typography>
          {!isSubmitting ? (
            hasRequest ? (
              <IconButton style={{ color: "#427DE3" }}>
                <CheckCircleOutlined sx={{ fontSize: 30 }} />
              </IconButton>
            ) : (
              <IconButton
                style={{ color: "#427DE3" }}
                onClick={() => submitRequest()}
              >
                <LockOpenTwoTone sx={{ fontSize: 50 }} />
              </IconButton>
            )
          ) : (
            <CircularProgress />
          )}
        </CardContent>
      </Card>
    </>
  );
};
