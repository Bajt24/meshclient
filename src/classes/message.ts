export class Message {
    senderId: string;
    senderName: string;
    time: Date;
    text: string;

    constructor(senderId: string, senderName: string, time: Date, text: string) {
        this.senderId = senderId;
        this.senderName = senderName;
        this.time = time;
        this.text =  text;
    }

}