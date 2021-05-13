import { StreamType } from "./streamtype";

export class OnStreamDataMsg {
    type: StreamType;
    id: string;

    constructor(id: string, type: StreamType) {
        this.id = id;
        this.type = type;
    }
}