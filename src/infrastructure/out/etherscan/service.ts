import * as _ from "lodash";
import { ethers } from "ethers";
import * as dayjs from "dayjs";
import { RestClient } from "../../../common/restClient";
import { EtherscanProperties } from "./properties";
import { Transaction, TransactionType } from "../../../domain/model";

export default class EtherscanService {
  private static ERC20_CONTRACTS = [
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
  ];

  private properties: EtherscanProperties;

  private restClient: RestClient;

  constructor(properties: EtherscanProperties, restClient: RestClient) {
    this.properties = properties;
    this.restClient = restClient;
  }

  async GetNormalTransactions() {
    const response = await this.generateRequest("txlist", "");

    const body = _.get(response, "result", null);

    if (body) {
      const txns =
        _.isArray(body) && body.map((txn) => this.mapToTransaction(txn));
      return txns;
    }
    throw new Error("Cannot get normal transcations");
  }

  async GetERC20Transactions() {
    const requestToEtherscan = EtherscanService.ERC20_CONTRACTS.map(
      (contract) => this.generateRequest("tokentx", contract)
    );

    const responseFromEtherscan = await Promise.all(requestToEtherscan);

    const txnFormatted = responseFromEtherscan
      .filter((response) => response.status < 204)
      .map((response) => {
        const body = _.get(response, "result", null);
        return _.isArray(body) && body.map((txn) => this.mapToTransaction(txn));
      });

    return _.flatMap(txnFormatted);
  }

  private generateRequest(action: string, contract: string) {
    const params = {
      module: "account",
      action,
      address: this.properties.address,
      contractaddress: contract || "",
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "10",
      sort: "desc",
      apikey: this.properties.token,
    };

    return this.restClient.request("get", "/api", params);
  }

  private mapToTransaction(txn: any): Transaction {
    const amount = ethers.utils.formatUnits(txn.value, txn.tokenDecimal || 18);
    return {
      to: txn.to,
      from: txn.from,
      type:
        txn.to === this.properties.address
          ? TransactionType.TransferIn
          : TransactionType.TransferOut,
      amount: `$${amount.toString()} ${txn.tokenSymbol || "ETH"}`,
      txn_id:
        txn.hash.slice(0, 5) +
        txn.hash.slice(txn.hash.length - 5, txn.hash.length),
      token: `${txn.tokenName || "Ethereum"}`,
      date: dayjs.unix(txn.timeStamp).format("MM/DD/YYYY HH:mm"),
    };
  }
}
