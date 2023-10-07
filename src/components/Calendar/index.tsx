import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./component.css";
import EventModal, { Mode } from "../EventModal/index";
import { SideBar } from "../SideBar";
import { useLocation } from "react-router-dom";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { firestore } from "../../firebase-config";
import UserContext from "../../contexts/UserContext";

const localizer = momentLocalizer(moment);

export interface CalendarEvent extends Event {
  title: string;
  description?: string; // If you want to add description as an optional property
  start: Date;
  end: Date;
  author: string;
  id: string;
  color: string;
}

interface CalendarProps {}

const CalendarComponent: React.FC<CalendarProps> = () => {
  const { groupId, groupName } = useLocation().state;

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalMode, setModalMode] = useState<Mode>("add");
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<CalendarEvent>({} as CalendarEvent);
  const [eventSubmitted, setEventSubmitted] = useState(false);

  const { user } = useContext(UserContext);
  const eventsRef = collection(firestore, "events"); // Reference to 'groups' collection

  useEffect(() => {
    const getEvents = async () => {
      let eventsToSet: CalendarEvent[] = [];
      const eventQuery = query(
        eventsRef,
        where("groupId", "==", groupId ?? "")
      );
      const querySnapshot = await getDocs(eventQuery);
      querySnapshot.forEach((event) => {
        console.log("event data", event.data());
        eventsToSet.push({
          start: new Date(event.data().start.toDate()),
          end: new Date(event.data().end.toDate()),
          title: event.data().title,
          description: event.data().description,
          author: event.data().author,
          id: event.data().id,
          color: event.data().color,
        });
      });
      console.log("events to set", eventsToSet);
      setEvents(eventsToSet);
    };
    getEvents();
  }, [eventSubmitted]);

  const handleSlotSelection = (slotInfo: any) => {
    setEventSubmitted(false);
    setFormData({
      title: "",
      start: slotInfo.start, // set the selected date as start date
      end: slotInfo.end,
      groupId,
      author: user?.email,
      authorUid: user?.uid,
      id: slotInfo.id,
      color: user?.color,
    } as CalendarEvent);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleEventSubmit = async (eventData: CalendarEvent) => {
    try {
      const eventsCollectionRef = collection(firestore, "events");
      await addDoc(eventsCollectionRef, eventData);
    } catch (err) {
      console.error("error persisting event", err);
    }
    setModalOpen(false);
    setEventSubmitted(true);
  };

  // Custom Event component
  const ColoredEvent = ({ event }: any) => {
    return (
      <div style={{ display: "flex", alignItems: "center", padding: "2px" }}>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: event.color,
            border: "2px solid white", // Adding white border
            marginRight: "5px", // Add some margin to separate from the title
          }}
        ></div>
        {event.title}
      </div>
    );
  };

  const handleEventClick = (event: CalendarEvent) => {
    setFormData(event);
    setModalMode("view"); // Setting mode to view
    setModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Header */}

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <SideBar groupName={groupName} />
        </div>
        {/* Calendar */}
        <div className="calendar-container">
          <Calendar
            components={{
              event: ColoredEvent,
            }}
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
