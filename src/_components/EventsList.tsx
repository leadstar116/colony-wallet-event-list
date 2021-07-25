import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadEvents } from "../_helpers/events.thunk";
import Event from "./Event";
import { initialState } from "../_constants/state.interface";

const EventList = () => {
  const dispatch = useDispatch();
  const eventList = useSelector((state: initialState) => state.eventsReducer);
  const alertState = useSelector((state: initialState) => state.alertReducer);

  // Load events
  useEffect(() => {
    dispatch(loadEvents());
  }, []);

  return (
    <div className="events-container">
      {eventList.events.map((event, index) => (
        <Event event={event} key={index} />
      ))}
      {alertState !== undefined && (
        <div className={alertState.alertClass}>{alertState.alertMessage}</div>
      )}
    </div>
  );
};

export default EventList;
