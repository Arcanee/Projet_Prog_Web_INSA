import * as objet from "./objet.js"

export class Equipement extends objet.Objet {
	constructor(id, nom, description, icone, animation) {
		super(id, nom, description, icone, animation);
	}
}