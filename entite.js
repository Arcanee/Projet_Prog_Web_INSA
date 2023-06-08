export class Entite {
	constructor(id, nom, attaque, critique, esquive, defense, pvMax, experience) {
		this._id = id;
		this._nom = nom;
		this._attaque = attaque;
		this._critique = critique;
		this._esquive = esquive;
		this._defense = defense;
		this._pvMax = pvMax;
		this._pv = pvMax;
		this._experience = experience;
	}

	get id() {return this._id;}
	get nom() {return this._nom;}
	get attaque() {return this._attaque;}
	get critique() {return this._critique;}
	get esquive() {return this._esquive;}
	get defense() {return this._defense;}
	get pvMax() {return this._pvMax;}
	get pv() {return this._pv;}
	get experience() {return this._experience;}


	set id(valeur) {this._id = valeur;}
	set nom(valeur) {this._nom = valeur;}
	set attaque(valeur) {this._attaque = valeur;}
	set critique(valeur) {this._critique = valeur;}
	set esquive(valeur) {this._esquive = valeur;}
	set defense(valeur) {this._defense = valeur;}
	set pvMax(valeur) {this._pvMax = valeur;}
	set pv(valeur) {this._pv = valeur;}
	set experience(valeur) {this._experience = valeur;}

	recevoirDegats(montant) {
		let chanceEsq = Math.ceil(Math.random() * 100);
		if (chanceEsq > this.esquive) {
			if(montant - this.defense < 0)
			{
				this.pv-=1;
			}
			else
			{
				this.pv -= (montant - this.defense);}
			}
		else {console.log('Il a esquivé !');}	//CONSOLE_LOG
	}

	infligerDegats(montant, autreEntite) {
		let chanceCrit = Math.ceil(Math.random() * 100);
		let degatsBonus = 0;
		if (chanceCrit <= this.critique) {degatsBonus = montant; console.log('COUP CRITIQUE !')} //CONSOLE_LOG
		autreEntite.recevoirDegats(montant + degatsBonus);
	}

	estMort() {return this.pv <= 0;}
}