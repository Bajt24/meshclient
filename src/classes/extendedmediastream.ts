import { StreamType } from "./streamtype";

export class ExtendedMediaStream {
    public stream: MediaStream;
    public type: StreamType;

    constructor(stream: MediaStream, type: StreamType) {
        this.stream = stream;
        this.type = type;
    }

}