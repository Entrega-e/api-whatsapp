import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { create, Whatsapp, Message, SocketState } from "venom-bot";

export type QRCode = {
  base64Qr: string;
};

class Sender {
  private client: Whatsapp;
  private connected: boolean;
  private qr: QRCode;

  get isConnected(): boolean {
    return this.connected;
  }
  get qrCode(): QRCode {
    return this.qr;
  }

  constructor() {
    this.initialize();
  }

  async sendText(to: string, body: string) {
    try {
      if (!isValidPhoneNumber(to, "BR")) {
        throw new Error("This number is not valid");
      }

      let phoneNumber = parsePhoneNumber(to, "BR")
        ?.format("E.164")
        .replace("+", "") as string;

      phoneNumber = phoneNumber.includes("@c.us")
        ? phoneNumber
        : `${phoneNumber}@c.us`;

      await this.client.sendText(phoneNumber, body);
    } catch (error) {
      console.error("error", error);
      throw new Error();
    }
  }

  private initialize() {
    const qr = (base64Qr: string) => {
      this.qr = { base64Qr };
    };

    const status = (statusSession: string) => {
      // status retornados pela biblioteca
      // isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled ||
      // desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected ||
      // noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp ||
      // successPageWhatsapp || waitForLogin || waitChat || successChat

      this.connected = ["isLogged", "qrReadSuccess", "chatsAvaliable"].includes(
        statusSession
      );
    };

    const start = (client: Whatsapp) => {
      this.client = client;

      client.onStateChange((state) => {
        this.connected = state === SocketState.CONNECTED;
      });
    };

    create({ session: "ws-sender-dev", multidevice: false })
      .then((client) => start(client))
      .catch((error) => console.log(error));
  }
}

export default Sender;
