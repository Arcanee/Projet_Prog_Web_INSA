import * as objet from "./objet.js"

export class Sort extends objet.Objet { 
    constructor(id, nom, description,  icone,  animation, prix, cout, degats) {
        if(typeof(id) == "object")
        {
            let obj = id;
            super(obj);
	        this._degats = obj.degats;
	        this._cout = obj.cout;
        }
        else
        {
            super(id, nom, description, icone, animation, prix);
            this._effet = effet;
	        this._degats = degats;
	        this._cout = cout;
        }
    }

    get degats() {return this._degats; }
    get cout() {return this._cout; }

    set degats(valeur) { this._degats = valeur; }
    set cout(valeur) {this._cout = valeur; }

}