export default interface Portfolio {
	id: string;
	name: string;
}

export interface PortfolioShare {
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

export class CreatePortfolioModel {
	name: string = "";
}
