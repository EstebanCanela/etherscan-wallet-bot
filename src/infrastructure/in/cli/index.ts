import dotenv from "dotenv";
import SendMessageUseCase from "../../../application/sendMessage/usecase";
import { RestClient } from "../../../common/restClient";
import { EtherscanProperties } from "../../out/etherscan/properties";
import EtherscanService from "../../out/etherscan/service";
import { TelegramProperties } from "../../out/telegram/properties";
import TelegramService from "../../out/telegram/service";

dotenv.config();

const initialize = async () => {
  if (
    !process.env.TELEGRAM_TOKEN ||
    !process.env.TELEGRAM_CHAT_ID ||
    !process.env.ETHERSCAN_TOKEN ||
    !process.env.ADDRESS
  ) {
    throw Error("Not found env vars");
  }

  console.log("======= Starting Etherscan =======");

  const etherscanProperties: EtherscanProperties = {
    token: process.env.ETHERSCAN_TOKEN,
    address: process.env.ADDRESS,
  };

  const telegramProperties: TelegramProperties = {
    token: process.env.TELEGRAM_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  };

  const etherscanRestClient = new RestClient(
    "https://api.etherscan.io/",
    10000
  );

  const etherscanService = new EtherscanService(
    etherscanProperties,
    etherscanRestClient
  );

  const telegramService = new TelegramService(telegramProperties);

  const sendMessageUseCase = new SendMessageUseCase(
    etherscanService,
    telegramService
  );

  await sendMessageUseCase.execute();
  console.log("======= Finished Etherscan Bot by efcanela =======");
};

initialize();
