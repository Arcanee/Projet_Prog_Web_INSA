import * as equipement from "./equipement.js"

export class Arme extends equipement.Equipement {
    
    constructor(id, nom, description, icone, animation, type, degats)
    {
        super(id, nom, description, icone, animation, type);
        this._degats = degats;
    }

    get degats() {return this._degats; }

    set degats(degats) { this._degats = degats; } 

}