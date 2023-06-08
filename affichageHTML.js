import * as personnage from "./personnage.js"
import * as monstre from "./monstre.js"


export class AffichageHTML {
    constructor()
    {
    	this._perso = new Map();
    	this._monstre = new Map();
    	this._perso.set('nom', document.getElementById("nomPerso"));
    	this._perso.set('pv', document.getElementById("pvPerso"));
    	this._perso.set('attaque', document.getElementById("attaquePerso"));
    	this._perso.set('defense', document.getElementById("defPerso"));
    	this._perso.set('esquive', document.getElementById("esquivePerso"));
    	this._perso.set('critique', document.getElementById("critiquePerso"));
    	this._perso.set('mana', document.getElementById("manaPerso"));
        this._perso.set('pieces', document.getElementById("piecesPerso"));

    	this._monstre.set('nom', document.getElementById("nomMonstre"));
    	this._monstre.set('pv', document.getElementById("pvMonstre"));
    	this._monstre.set('attaque', document.getElementById("attaqueMonstre"));
    	this._monstre.set('defense', document.getElementById("defMonstre"));
    	this._monstre.set('esquive', document.getElementById("esquiveMonstre"));
    	this._monstre.set('critique', document.getElementById("critiqueMonstre"));


    }

    get perso() {return this._perso;}
    get monstre() {return this._monstre;}

    set perso(valeur) {this._perso = valeur;}
    set monstre(valeur) {this._monstre = valeur;}


    remplirPerso(perso)
    {
    	this._perso.get('nom').innerText = perso.nom;
    	this._perso.get('pv').innerText = perso.pv;
    	this._perso.get('attaque').innerText = perso.attaque;
    	this._perso.get('defense').innerText = perso.defense;
    	this._perso.get('esquive').innerText = perso.esquive;
    	this._perso.get('critique').innerText = perso.critique;
    	this._perso.get('mana').innerText = perso.mana;
        this._perso.get('pieces').innerText = perso.economie;
    }

    remplirMonstre(monstre)
    {
    	this._monstre.get('nom').innerText = monstre.nom;
    	this._monstre.get('pv').innerText = monstre.pv;
    	this._monstre.get('attaque').innerText = monstre.attaque;
    	this._monstre.get('defense').innerText = monstre.defense;
    	this._monstre.get('esquive').innerText = monstre.esquive;
    	this._monstre.get('critique').innerText = monstre.critique;
    }

    resetMonstre()
    {
        this._monstre.get('nom').innerText = "-";
        this._monstre.get('pv').innerText = "-";
        this._monstre.get('attaque').innerText = "-";
        this._monstre.get('defense').innerText = "-";
        this._monstre.get('esquive').innerText = "-";
        this._monstre.get('critique').innerText = "-";
    }

}