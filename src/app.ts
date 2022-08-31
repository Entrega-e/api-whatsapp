import Sender from "./sender";
import express, { Request, Response } from "express";

const sender = new Sender();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  return res.status(200).send({
    success: 'true',
    message: 'Connection successfully - Wellcome to Zap-aê!',
    version: '1.0.0',
  });
});

app.get("/status", (req: Request, res: Response) => {
  return res.send({
    qr_code: sender.qrCode,
    connected: sender.isConnected,
  });
});

app.get("/qr", (req: Request, res: Response) => {
  return res.send({
    qr_code: sender.qrCode,
  });
});

app.post("/send", async (req: Request, res: Response) => {
  const { number, message } = req.body;

  try {
    const phoneNumber = number?.toString();

    await sender.sendText(phoneNumber, message);

    return res.status(200).json();
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ status: "error", message: "ERROR" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Listen on port ", port);
});
