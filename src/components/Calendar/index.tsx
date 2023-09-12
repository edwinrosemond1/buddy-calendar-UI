import React, { useState } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./component.css";
import EventModal from "../EventModal/index";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle"; // This is a sample profile icon from Material-UI

const localizer = momentLocalizer(moment);

export interface CalendarEvent extends Event {
  title: string;
  description?: string; // If you want to add description as an optional property
  start: Date;
  end: Date;
}

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      start: moment().toDate(),
      end: moment().add(1, "days").toDate(),
      title: "Sample Event",
    },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<CalendarEvent>({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
  });

  const handleSlotSelection = (slotInfo: any) => {
    setFormData({
      ...formData,
      start: slotInfo.start, // set the selected date as start date
      end: slotInfo.end,
    });
    setModalOpen(true);
  };

  const handleEventSubmit = (eventData: CalendarEvent) => {
    setEvents([...events, eventData]);
    setModalOpen(false);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Buddy Calendar
          </Typography>
          <IconButton edge="end" color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">My Sidebar Content</div>

        {/* Calendar */}
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%", width: "100%" }}
            selectable={true}
            onSelectSlot={handleSlotSelection}
          />
        </div>
        <EventModal
          isOpen={isModalOpen}
          onRequestClose={() => setModalOpen(false)}
          onSubmit={handleEventSubmit}
          formData={formData}
          setFormData={setFormData}
          setModalOpen={setModalOpen}
        />
      </div>

      {/* Footer */}
      <div className="footer">My Footer Content</div>
    </div>
  );
};

export default CalendarComponent;
