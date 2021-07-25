import configureStore from "redux-mock-store";
import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import EventsList from "./EventsList";
import { EventLog, EventType } from "../_constants/event.interface";

describe("EventsList Component", () => {
  const testEventLog: EventLog = {
    logTime: 1519211809934,
    type: EventType.PAYOUT_CLAMIMED,
    userAddress: "0xF0CdfA126a944849A6e9982253CD5259AfAe0355",
    amount: "30",
    fundingPotId: "190x6B175474E89094C44Da98b954EedeAC495271d0F",
    token: "4D22AS",
  };

  const eventsState = {
    events: [testEventLog],
  };

  const mockStore = configureStore();
  let store = mockStore({
    eventsReducer: eventsState,
  });

  store.dispatch = jest.fn();

  let component = renderer.create(
    <Provider store={store}>
      <EventsList />
    </Provider>
  );

  it("should render with given props", () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
