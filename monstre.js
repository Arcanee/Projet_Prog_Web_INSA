import * as entite from "./entite.js"

export class Monstre extends entite.Entite {
	constructor(id, nom, attaque, critique, esquive, defense, pv, experience, image, musique) {
		super(id, nom, attaque, critique, esquive, defense, pv, experience);
		this._image = image;
		this._musique = musique;
	}

	attaquer(autreEntite) {
		this.infligerDegats(this.attaque, autreEntite);
	}

	get image() {return this._image;}
	get musique() {return this._musique;}

	set image(valeur) {this._image = valeur;}
	set musique(valeur) {this._musique = valeur;}
}