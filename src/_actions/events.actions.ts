import { EventLog } from "../_constants/event.interface";

export const EVENTS_LOADED_SUCCESSFULLY = "EVENTS_LOADED_SUCCESSFULLY";
export const eventsLoadedSuccessfully = (events: Array<EventLog>) => ({
  type: EVENTS_LOADED_SUCCESSFULLY,
  payload: { events },
});
