import * as objet from "./objet.js"

export class Utilisable extends objet.Objet {   
    constructor(id, nom, description,  icone,  animation, prix, effet) {
        if(typeof(id) == "object")
        {
            let obj = id;
            super(obj);
            this._effet = obj.effet;
        }
        else
        {
            super(id, nom, description, icone, animation);
            this._effet = effet;
        }
    }

    get effet() {return this._effet;}

    set effet(valeur) {this._effet = valeur;}

}

