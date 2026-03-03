import twilio from 'twilio';


const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_SMS,
    TWILIO_FROM_WAPP
} = process.env;


const client = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN)
                ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                : null;

export class MessagingsService {
    #client;
    constructor(twilioClient = client) { this.#client = twilioClient }
    #assert() { if(!this.#client) throw new Error("Twilio no configurado (.env)")}

    async sendSMS({to, body}) {
        this.#assert();
        if(!to || !body) throw new Error("Falta alguno de los campos to o body");
        if(!TWILIO_FROM_SMS) throw new Error("Falta TWILIO_FROM_SMS, o no esta configurado");

        const m = await this.#client.messages.create({from: TWILIO_FROM_SMS, to, body});
        return { sid: m.sid, status: m.status}
    }

    async sendWhatsApp({to, body}) {
        this.#assert();
        if(!to || !body) throw new Error("Falta alguno de los campos to o body");
        if(!TWILIO_FROM_WAPP) throw new Error("Falta TWILIO_FROM_WAPP, o no esta configurado");

        const m = await this.#client.messages.create({from: TWILIO_FROM_WAPP, to, body});
        return { sid: m.sid, status: m.status}
    }

}

export const messagingService = new MessagingsService();