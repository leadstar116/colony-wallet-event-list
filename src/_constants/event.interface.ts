export interface EventState {
  events: EventLog[];
}

export enum EventType {
  COLONY_INITIALISED = "ColonyInitialised",
  COLONY_ROLE_SET = "ColonyRoleSet",
  PAYOUT_CLAMIMED = "PayoutClaimed",
  DOMAIN_ADDED = "DomainAdded",
}

export interface EventLog {
  logTime: number;
  type: EventType;
  domainId?: string;
  role?: string;
  userAddress?: string;
  amount?: string;
  fundingPotId?: string;
  token?: string;
}
