import React, { useContext } from "react";
import Modal from "react-modal";
import moment from "moment";
import "./component.css";
import Button from "@mui/material/Button";
import { TextField, Grid, Divider } from "@mui/material";
import { CalendarEvent } from "../Calendar";
import { v4 as uuidv4 } from "uuid";
import UserContext from "../../contexts/UserContext";

export type Mode = "view" | "add";

interface EventModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (eventData: CalendarEvent) => void;
  formData: CalendarEvent;
  setFormData: React.Dispatch<React.SetStateAction<CalendarEvent>>;
  setModalOpen: (value: React.SetStateAction<boolean>) => void;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
  formData,
  setFormData,
  setModalOpen,
  mode,
  setMode,
}) => {
  const { user } = useContext(UserContext);

  const handleSubmit = async () => {
    const id = uuidv4();
    onSubmit({ ...formData, id, author: user?.email as string });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Event Modal"
      ariaHideApp={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "500px",
        },
      }}
    >
      <h2 className="modal-header">
        {mode === "add" ? "Add Event" : "Event Details"}
        {mode === "view" && user?.email === formData.author && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setMode("add")}
          >
            Edit
          </Button>
        )}
      </h2>
      <Divider style={{ marginBottom: "15px", marginTop: "10px" }} />

      <Grid container direction="column" spacing={3}>
        {" "}
        {/* Adjusted spacing */}
        <Grid item>
          <TextField
            sx={{ width: 300 }}
            id="outlined-basic-title"
            label="Title"
            variant="outlined"
            fullWidth
            value={formData.title}
            disabled={mode === "view"}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </Grid>
        <Grid item>
          <TextField
            id="outlined-basic-description"
            label="Description"
            variant="outlined"
            value={formData.description}
            disabled={mode === "view"}
            fullWidth
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Grid>
        <Grid item>
          <label>Start Date:</label>
          <input
            className="input-field"
            type="datetime-local"
            value={moment(formData.start).format("YYYY-MM-DDTHH:mm")}
            disabled={mode === "view"}
            onChange={(e) =>
              setFormData({ ...formData, start: new Date(e.target.value) })
            }
          />
        </Grid>
        <Grid item>
          <label>End Date:</label>
          <input
            className="input-field"
            type="datetime-local"
            value={moment(formData.end).format("YYYY-MM-DDTHH:mm")}
            disabled={mode === "view"}
            onChange={(e) =>
              setFormData({ ...formData, end: new Date(e.target.value) })
            }
          />
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        color="secondary"
        style={{ marginRight: "10px" }}
        onClick={() => setModalOpen(false)}
      >
        Cancel
      </Button>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Modal>
  );
};

export default EventModal;
