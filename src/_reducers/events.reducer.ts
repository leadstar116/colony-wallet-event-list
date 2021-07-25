import { EVENTS_LOADED_SUCCESSFULLY } from "../_actions/events.actions";
import { EventLog } from "../_constants/event.interface";

const eventsState = {
  events: [] as EventLog[],
};
const eventsReducer = (state = eventsState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case EVENTS_LOADED_SUCCESSFULLY:
      return {
        ...state,
        events: payload.events,
      };
    default:
      break;
  }
  return state;
};

export default eventsReducer;
