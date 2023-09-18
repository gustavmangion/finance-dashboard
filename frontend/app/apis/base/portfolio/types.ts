export default interface Portfolio {
	id: string;
	name: string;
}

export class EditPortfolioModel {
	id: string = "";
	body: EditPortfolioModelBody = new EditPortfolioModelBody();
}

class EditPortfolioModelBody {
	name: string = "";
}
