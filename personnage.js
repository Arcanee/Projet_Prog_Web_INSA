import * as entite from "./entite.js"

export class Personnage extends entite.Entite {
	constructor(id, nom, attaque, critique, esquive, defense, pvMax, manaMax, experience, economie, objets, sorts, arme, puissance) {
		super(id, nom, attaque, critique, esquive, defense, pvMax, experience);
		this._manaMax = manaMax;
		this._mana = manaMax;
		this._economie = economie;
		this._objets = objets;
		this._sorts = sorts;
		this._arme = arme;
		this._puissance = puissance;
	}

	get manaMax() {return this._manaMax;}
	get mana() {return this._mana;}
	get economie() {return this._economie;}
	get objets() {return this._objets;}
	get sorts() {return this._sorts;}
	get arme() {return this._arme;}
	get puissance() {return this._puissance;}

	set manaMax(valeur) {this._manaMax = valeur;}
	set mana(valeur) {this._mana = valeur;}
	set economie(valeur) {this._economie = valeur;}
	set objets(valeur) {this._objets = valeur;}
	set sorts(valeur) {this._sorts = valeur;}
	set arme(valeur) {this._arme = valeur;}
	set puissance(valeur) {this._puissance = valeur;}

	utiliserArme(autreEntite) {
		this.infligerDegats(this.arme.degats + this.attaque, autreEntite);
	}

	utiliserSort(sort, autreEntite) {
		this.infligerDegats(sort.degats + this.puissance, autreEntite);
		this.mana -= sort.cout;
	}

	utiliserObjet(objet) {
		this.utiliser(objet, this);
	}


	ajoutObjet(objet)
	{

		const table = document.getElementById("inventaire");
		if (!(document.getElementById(objet.nom)))
		{
			
			const row = document.createElement("tr");
			row.id = objet.nom; 

			const cellNom = document.createElement("td");
			const cellQuantite = document.createElement("td");
			const cellDescr = document.createElement("td");

			cellNom.innerText = objet.nom; 
			cellQuantite.innerText = this.objets[objet.nom]; 
			cellDescr.innerText = objet.effet;

			row.appendChild(cellNom);
			row.appendChild(cellQuantite);
			row.appendChild(cellDescr);
			table.appendChild(row)
		}
		else
		{
			const row = document.getElementById(objet.nom); 
			const cell = row.childNodes[1]; 
			cell.innerText = this.objets[objet.nom];
		}


	}

	actualiserInventaire()
	{
		const table = document.getElementById("inventaire");
		for (let i in this.objets)
		{
			let row = document.getElementById(i)
			if (row)
			{
				row.childNodes[1].innerText = this.objets[i];
			}
		}
	}


    utiliser(objet) {
        switch (objet) {
            case "Potion de Sante":
                this.pv += 20;//REMPLIR;
                if (this.pv > this.pvMax) {this.pv = this.pvMax;}
                break;
            case "Potion de Mana":
       	    	this.mana += 20;//REMPLIR;
       	    	if (this.mana > this.manaMax) {this.mana = this.manaMax;}
       	    	break;
   	    	case "Potion de Force":
   	    		this.attaque += 20;//REMPLIR;
   	    		break;
   	    	case "Potion de Defense":
   	    		this.defense += 20;//REMPLIR;
   	    		break;
   	    	case "Boeuf Bourguignon":
   	    		this.pv = this.pvMax;
   	    		this.mana = this.manaMax;
                break;
   	    	case "De de Chance":
   	    		this.economie += Math.ceil(Math.random() * 3);
                break;
            default:
                break;
        }
    }
}