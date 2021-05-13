export class OfferData {
    offer: string;
    id: string;

	constructor($id: string, $offer: string = null) {
        this.id = $id;
		this.offer = $offer;
	}
}