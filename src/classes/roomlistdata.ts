export class RoomListData {
    key: string;
    name: string;
    userCount: number;

    constructor(key:string, name: string, userCount: number) {
        this.key = key;
        this.name = name;
        this.userCount = userCount;
    }
}