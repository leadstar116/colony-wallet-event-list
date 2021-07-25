import {
  getColonyNetworkClient,
  getLogs,
  Network,
  getBlockTime,
  ColonyRole,
} from "@colony/colony-js";
import { Wallet, utils, EventFilter, providers as ETHProvider } from "ethers";
import { eventsLoadedSuccessfully } from "../_actions/events.actions";
import {
  alertClear,
  alertFailure,
  alertLoading,
} from "../_actions/alert.actions";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { EventLog, EventType } from "../_constants/event.interface";

type MyRootState = {};
type MyExtraArg = undefined;
type MyThunkDispatch = ThunkDispatch<MyRootState, MyExtraArg, Action>;

// Set up the network address constants that you'll be using
// The two below represent the current ones on mainnet
// Don't worry too much about them, just use them as-is
const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

// Get a new Infura provider (don't worry too much about this)
const provider = new ETHProvider.InfuraProvider();

// Get a random wallet
// You don't really need control over it, since you won't be firing any trasactions out of it
const wallet = Wallet.createRandom();
// Connect your wallet to the provider
const connectedWallet = wallet.connect(provider);

const getColonyClient = async () => {
  // Get a network client instance
  const networkClient = await getColonyNetworkClient(
    Network.Mainnet,
    connectedWallet,
    {
      networkAddress: MAINNET_NETWORK_ADDRESS,
    }
  );

  // Get the colony client instance for the betacolony
  const colonyClient = await networkClient.getColonyClient(
    MAINNET_BETACOLONY_ADDRESS
  );
  return colonyClient;
};

const loadEventsFromColony = async (type: EventType) => {
  const colonyClient = await getColonyClient();

  let eventFilter: EventFilter = {};
  switch (type) {
    case EventType.COLONY_INITIALISED:
      eventFilter = colonyClient.filters.ColonyInitialised();
      break;

    case EventType.COLONY_ROLE_SET:
      eventFilter = colonyClient.filters.ColonyRoleSet();
      break;

    case EventType.DOMAIN_ADDED:
      eventFilter = colonyClient.filters.DomainAdded();
      break;

    case EventType.PAYOUT_CLAMIMED:
    default:
      eventFilter = colonyClient.filters.PayoutClaimed();
      break;
  }

  // Get the raw logs array
  const eventLogs = await getLogs(colonyClient, eventFilter);

  const parsedLogs = eventLogs.map((event) =>
    colonyClient.interface.parseLog(event)
  );

  const result = await Promise.all(
    parsedLogs.map(async (singleLog) => {
      // Use the blockHash to look up the actual time of the block that mined the transactions of the current event
      const logTime = await getBlockTime(provider, singleLog.blockHash);

      const singleLogResult: EventLog = {
        logTime,
        type,
      };

      if (type === EventType.DOMAIN_ADDED || type === EventType.COLONY_ROLE_SET) {
        const humanReadableDomainId = new utils.BigNumber(
          singleLog.values.domainId
        ).toString();
        singleLogResult['domainId'] = humanReadableDomainId;
      }

      if (type === EventType.PAYOUT_CLAMIMED) {
        const humanReadableFundingPotId = new utils.BigNumber(
          singleLog.values.fundingPotId
        ).toString();

        const { associatedTypeId } = await colonyClient.getFundingPot(
          humanReadableFundingPotId
        );

        const { recipient: userAddress } = await colonyClient.getPayment(
          associatedTypeId
        );

        singleLogResult['userAddress'] = userAddress;

        const humanReadableAmount = new utils.BigNumber(singleLog.values.amount);
        const wei = new utils.BigNumber(10);

        // The converted amount is the human readable amount divided by the wei value raised to the power of 18
        const convertedAmount = humanReadableAmount.div(wei.pow(18)).toString();
        singleLogResult['amount'] = convertedAmount;
        singleLogResult['fundingPotId'] = humanReadableFundingPotId;
      }

      if (type === EventType.COLONY_ROLE_SET) {
        singleLogResult['role'] = ColonyRole[singleLog.values.role];
        singleLogResult['userAddress'] = singleLog.values.user;
      }

      singleLogResult['token'] = singleLog.values.token;
      return singleLogResult;
    })
  );

  return result;
};

export const loadEvents = () => async (dispatch: MyThunkDispatch) => {
  try {
    dispatch(alertLoading("Loading..."));

    const payoutClaimedEvents: EventLog[] = await loadEventsFromColony(
      EventType.PAYOUT_CLAMIMED
    );
    const colonyInitialisedEvents: EventLog[] = await loadEventsFromColony(
      EventType.COLONY_INITIALISED
    );
    const domainAddedEvents: EventLog[] = await loadEventsFromColony(
      EventType.DOMAIN_ADDED
    );
    const roleSetEvents: EventLog[] = await loadEventsFromColony(
      EventType.COLONY_ROLE_SET
    );

    let allLogs: EventLog[] = [];
    allLogs = allLogs.concat(payoutClaimedEvents, colonyInitialisedEvents, domainAddedEvents, roleSetEvents).sort((a, b) => b.logTime - a.logTime);

    dispatch(eventsLoadedSuccessfully(allLogs));
    dispatch(alertClear());
  } catch (e) {
    dispatch(alertFailure(e.toString()));
  }
};
