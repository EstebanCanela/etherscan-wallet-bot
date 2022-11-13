import { Telegraf } from "telegraf";
import { TelegramProperties } from "./properties";

export default class TelegramService {
  private bot: Telegraf;

  private properties: TelegramProperties;

  constructor(properties: TelegramProperties) {
    this.properties = properties;
    this.bot = new Telegraf(properties.token);
  }

  async SendMessage(message: string) {
    await this.bot.telegram.sendMessage(this.properties.chatId, message, {
      parse_mode: "Markdown",
    });
  }
}
