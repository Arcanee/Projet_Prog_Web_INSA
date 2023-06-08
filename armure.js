import * as equipement from "./equipement.js"

export class Armure extends equipement.Equipement {
    
    constructor(id, nom, description, icone, type, armure)
    {
        super(id, nom, description, icone, type);
        this._resistance = resistance;
    }

    get armure() {return this._resistance; }

    set armure(armure) { this._resistance = resistance; } 

}