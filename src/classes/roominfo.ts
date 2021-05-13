export class RoomInfo {
    public created: number;
    public userCount: number; 

	constructor($created: number, $userCount: number = 0) {
		this.created = $created;
		this.userCount = $userCount;
    }
}