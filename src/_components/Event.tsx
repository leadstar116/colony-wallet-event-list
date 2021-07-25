import React from "react";
import { EventLog, EventType } from "../_constants/event.interface";
import makeBlockie from 'ethereum-blockies-base64';

type Props = {
  event: EventLog;
};

const Event = ({ event }: Props) => {
  const formatText = () => {
    let text: React.ReactNode = <></>;
    switch (event.type) {
      case EventType.COLONY_INITIALISED:
        text = <>Congratulations! It's a beautiful baby colony!`</>;
        break;
      case EventType.COLONY_ROLE_SET:
        text = <><b>{event.role}</b>{` role assigned to user `}<b>{event.userAddress}</b>{` in domain `}<b>{`${event.domainId}.`}</b></>;
        break;
      case EventType.DOMAIN_ADDED:
        text = <>{`Domain `}<b>{event.domainId}</b>{` added.`}</>;
        break;
      case EventType.PAYOUT_CLAMIMED:
        text = <>{`User `}<b>{event.userAddress}</b>{` claimed `}<b>{event.amount}{event.token}</b>{` payout from pot `}<b>{`${event.fundingPotId}.`}</b></>;
        break;

      default:
        break;
    }

    return text;
  };

  const formatDate = () => {
    const date = new Date(event.logTime).toLocaleString('en-us', { month:'short', day:'numeric' });
    return date;
  }

  return (
    <>
      <div className="event">
        <img className="avatar" src={makeBlockie(event.userAddress || event.token || event.domainId)} />
        <div className="text">
          <span className="main-text">{formatText()}</span>
          <span className="date">{formatDate()}</span>
        </div>
      </div>
    </>
  );
};

export default Event;
