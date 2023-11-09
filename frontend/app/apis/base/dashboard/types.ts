import { Dayjs } from "dayjs";

export default interface NumberCard {
	current: number;
	previous: number;
}

export class FilterModel {
	baseCurrency: string;
	from: string;
	to: string;
	portfolioId: string;

	constructor(
		baseCurrency: string,
		from: Dayjs,
		to: Dayjs,
		portfolioId: string
	) {
		this.baseCurrency = baseCurrency;
		this.from = from.toDate().toDateString();
		this.to = to.toDate().toDateString();
		this.portfolioId = portfolioId;
	}
}
