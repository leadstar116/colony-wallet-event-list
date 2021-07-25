import { EventLog, EventType } from "../_constants/event.interface";
import eventsReducer from "./events.reducer";
import * as eventsAction from "../_actions/events.actions";

describe("events reducer test", () => {
  let initialState = {
    events: [] as EventLog[],
  };

  const testEventLog: EventLog = {
    logTime: 1519211809934,
    type: EventType.PAYOUT_CLAMIMED,
    userAddress: "0xF0CdfA126a944849A6e9982253CD5259AfAe0355",
    amount: "30",
    fundingPotId: "190x6B175474E89094C44Da98b954EedeAC495271d0F",
    token: "4D22AS",
  };

  test("EVENTS_LOADED_SUCCESSFULLY: should return loaded events", () => {
    const events = [testEventLog];
    const expectedState = {
      events: events,
    };
    const action = {
      type: eventsAction.EVENTS_LOADED_SUCCESSFULLY,
      payload: { events },
    };
    const newState = eventsReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });
});
