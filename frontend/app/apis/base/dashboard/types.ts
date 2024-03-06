import { Dayjs } from "dayjs";

export default interface NumberCard {
	current: number;
	previous: number;
}

export class FilterModel {
	baseCurrency: string;
	from: string;
	to: string;
	portfolioId: string | undefined;
	filterById: string | undefined;

	constructor(
		baseCurrency: string,
		from: Dayjs,
		to: Dayjs,
		portfolioId: string,
		filterById: string = ""
	) {
		this.baseCurrency = baseCurrency;
		this.from = from.toDate().toDateString();
		this.to = to.toDate().toDateString();
		this.portfolioId = portfolioId === "All" ? undefined : portfolioId;
		this.filterById = filterById;
	}
}

export interface NameValueModel {
	name: string;
	value: number;
	count: number;
}
