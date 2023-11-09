import { Dayjs } from "dayjs";

export default interface NumberCard {
	current: number;
	previous: number;
}

export class FilterModel {
	baseCurrency: string;
	from: string;
	to: string;
	private _portfolioId = "";
	get portfolioId(): string | null {
		return this._portfolioId == "All" ? null : this._portfolioId;
	}
	set portfolioId(value: string) {
		this._portfolioId = value;
	}

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
