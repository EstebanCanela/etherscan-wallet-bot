import * as _ from "lodash";
import dayjs from "dayjs";
import { Transaction } from "../../domain/model";
import EtherscanService from "../../infrastructure/out/etherscan/service";
import TelegramService from "../../infrastructure/out/telegram/service";

export default class SendMessageUseCase {
  private etherscanService: EtherscanService;

  private telegramService: TelegramService;

  constructor(
    etherscanService: EtherscanService,
    telegramService: TelegramService
  ) {
    this.etherscanService = etherscanService;
    this.telegramService = telegramService;
  }

  async execute() {
    const [normalTransactions, erc20Transactions] = await Promise.all([
      this.etherscanService.GetNormalTransactions(),
      this.etherscanService.GetERC20Transactions(),
    ]);

    const transactions = _.concat(normalTransactions, erc20Transactions)
      .filter((txn) => dayjs(txn.date).isAfter(dayjs().subtract(10, "minutes")))
      .map((txn) =>
        this.telegramService.SendMessage(this.generateMessage(txn))
      );

    console.log(`Total transactions found: ${transactions.length}`);

    await Promise.all(transactions);
  }

  private generateMessage(txn: Transaction) {
    return `💸 *${txn.type}* \n Amount: *${txn.amount}* \n From: ${txn.from} \n To: ${txn.to} \n Date: ${txn.date} \n Id: ${txn.txn_id}`;
  }
}
