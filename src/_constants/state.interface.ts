import { AlertState } from "./alert.interface";
import { EventState } from "./event.interface";

export interface initialState {
  eventsReducer: EventState;
  alertReducer: AlertState;
}
