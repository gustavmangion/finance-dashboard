import { Dayjs } from "dayjs";

export default interface NumberCard {
	current: number;
	previous: number;
}

export class FilterModel {
	baseCurrency: string;
	from: string;
	to: string;

	constructor(baseCurrency: string, from: Dayjs, to: Dayjs) {
		this.baseCurrency = baseCurrency;
		this.from = from.toDate().toDateString();
		this.to = to.toDate().toDateString();
	}
}
