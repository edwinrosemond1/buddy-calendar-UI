import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./component.css";
import EventModal, { Mode } from "../EventModal/index";
import axios from "axios";
import { config } from "../../constants";

const localizer = momentLocalizer(moment);

export interface CalendarEvent extends Event {
  title: string;
  description?: string; // If you want to add description as an optional property
  start: Date;
  end: Date;
  author?: string;
  id: string;
}

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalMode, setModalMode] = useState<Mode>("add");
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<CalendarEvent>({} as CalendarEvent);
  const [eventSubmitted, setEventSubmitted] = useState(false);

  useEffect(() => {
    axios.get(config.apis.EVENT_LIST).then((response) => {
      console.log("list events", response);
      if (response.data) {
        const transformedEvents = response.data.map((event: CalendarEvent) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents([...transformedEvents]);
      }
    });
  }, [eventSubmitted]);

  const handleSlotSelection = (slotInfo: any) => {
    setEventSubmitted(false);
    setFormData({
      ...formData,
      start: slotInfo.start, // set the selected date as start date
      end: slotInfo.end,
    } as CalendarEvent);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleEventSubmit = async (eventData: CalendarEvent) => {
    try {
      await axios.post(config.apis.EVENT_CREATE, {
        ...eventData,
      });
    } catch (err) {
      console.log("error persisting event", err);
    }
    setModalOpen(false);
    setEventSubmitted(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log("slot event", event);
    setFormData(event);
    setModalMode("view"); // Setting mode to view
    setModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Header */}

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">My Sidebar Content</div>

        {/* Calendar */}
        <div className="calendar-container">
          <Calendar
            onSelectEvent={handleEventClick}
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
          mode={modalMode}
          setMode={setModalMode}
        />
      </div>

      {/* Footer */}
      <div className="footer">My Footer Content</div>
    </div>
  );
};

export default CalendarComponent;
