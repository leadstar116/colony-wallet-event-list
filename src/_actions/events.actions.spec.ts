import * as eventsAction from "./events.actions";
import { EventLog, EventType } from "../_constants/event.interface";

const testEventLog: EventLog = {
  logTime: 1519211809934,
  type: EventType.PAYOUT_CLAMIMED,
  userAddress: "0xF0CdfA126a944849A6e9982253CD5259AfAe0355",
  amount: "30",
  fundingPotId: "190x6B175474E89094C44Da98b954EedeAC495271d0F",
  token: "4D22AS",
};

describe("load event successfully action test", () => {
  it("should return loaded event", () => {
    const events: EventLog[] = [testEventLog];
    const expectedAction = {
      type: eventsAction.EVENTS_LOADED_SUCCESSFULLY,
      payload: { events },
    };
    expect(eventsAction.eventsLoadedSuccessfully(events)).toEqual(
      expectedAction
    );
  });
});
