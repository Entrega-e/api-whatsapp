import Sender from "./sender";
import express, { Request, Response } from "express"

const sender = new Sender() 

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/status', (req: Request, res: Response) => {
    return res.send({
        qr_code: sender.qrCode,
        connected: sender.isConnected,
    })
})

app.post('/send', async (req: Request, res: Response) => {

    console.log('req.body: ',req.body)

    const { number, message } = req.body 

    try{

        const phoneNumber = number?.toString()

        console.log('ULTIMO: ',phoneNumber)

        await sender.sendText( phoneNumber,message)

        return res.status(200).json()
    } catch (error) {
        console.error("error", error)
        
        res.status(500).json({ status: "error", message: 'ERROR'})
    }
})

app.listen(5001, () =>{
    console.log('Listen on port 5000')
})
