import React from "react";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { EventLog, EventType } from "../_constants/event.interface";
import Event from "./Event";

describe("Event Component", () => {
  const testEventLog: EventLog = {
    logTime: 1519211809934,
    type: EventType.PAYOUT_CLAMIMED,
    userAddress: "0xF0CdfA126a944849A6e9982253CD5259AfAe0355",
    amount: "30",
    fundingPotId: "190x6B175474E89094C44Da98b954EedeAC495271d0F",
    token: "4D22AS",
  };

  let component = renderer.create(
    <BrowserRouter>
      <Event event={testEventLog} />
    </BrowserRouter>
  );

  it("should render with given props", () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
