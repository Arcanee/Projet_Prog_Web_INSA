import * as graphique from "./graphique.js";
import * as personnage from "./personnage.js";
import * as monstre from "./monstre.js";
import * as arme from "./arme.js";
import * as sort from "./sort.js";
import * as utilisable from "./utilisable.js";
import * as etage from "./etage.js";
import * as histoire from "./histoire.js";
import * as affichageHTML from "./affichageHTML.js";
import * as musique from "./musique.js";
import * as boutique from "./boutique.js";
import * as clavier from "./clavier.js";

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

let refreshID;

class Jeu {
	//constructeur lancera chargement, boucle et fin
	//chargement
	//boucle
	//fin
	constructor() {
		// attributs
		this._ig = new graphique.Graphique();
		this._tabArmes = [];
		this._tabArmures = [];
		this._tabMonstres = [];
		this._tabSorts = [];
		this._tabUtilisables = [];
		this._tabBackgrounds = [];
		this._autresImages = {};
		this._perso = new personnage.Personnage("P01", "Ray", 30, 5, 5, 2, 250, 20, 0, 10, {"Potion de Sante":0,
                                                                                           "Boeuf Bourguignon":0,
                                                                                           "Potion de Mana":0,
                                                                                           "Potion de Force":0,
                                                                                           "De de Chance":0,
                                                                                           "Potion de Defense":0},  ["Trait de feu"], "Poings", 0);
		this._choix = 0;
		this._monstreActuel = null;
		this._etatJeu = "menu";
		this._etage = null;
		this._dialogues =[];
		this._IDobjetTrouve = null;
		this._typeObjetTrouve = "rien";

		this._sons = {}; 
		this._musiques = {};
		this._mute = 0;
		this._boutique = new boutique.Boutique(3,1.0);

		// texte utilisé pour la boutique & les sorts
		this._texteInfo = "";
		this._selectionCombat = "";


		// chargement des images => A faire dans un tableau
		//this.backgroundCbtBas =  this.ig.chargerImage("./elements/images/fonds/sol/DarkSpace.png", chargementCB.bind(this));
		//this.backgroundCbtHaut = this.ig.chargerImage("./elements/images/fonds/mur/Castle2.png", chargementCB.bind(this));
		//this.imgMonstre = this.ig.chargerImage("./elements/images/ennemies/Earthspirit.png", chargementCB.bind(this));
		
		//chargement des JSON et des images
		this.chargerLesJSON();
	}

	get ig() {return this._ig;}
	get tabArmes() {return this._tabArmes;}
	get tabArmures() {return this._tabArmures;}
	get tabMonstres() {return this._tabMonstres;}
	get tabSorts() {return this._tabSorts;}
	get tabUtilisables() {return this._tabUtilisables;}
	get tabBackgrounds() {return this._tabBackgrounds;}
	get autresImages() {return this._autresImages;}
	get perso() {return this._perso;}
	get choix() {return this._choix;}
	get monstreActuel() {return this._monstreActuel;}
	get etatJeu() {return this._etatJeu;}
	get etage() {return this._etage;}
	get dialogues() {return this._dialogues;}
	get IDobjetTrouve() {return this._IDobjetTrouve;}
	get typeObjetTrouve() {return this._typeObjetTrouve;}
	get sons() {return this._sons;}
	get musiques() {return this._musiques;}
	get mute() {return this._mute;}
	get boutique() {return this._boutique;}
	get texteInfo() {return this._texteInfo;}
	get selectionCombat() {return this._selectionCombat;}

	set ig(valeur) {this._ig = valeur;}
	set tabArmes(valeur) {this._tabArmes = valeur;}
	set tabArmures(valeur) {this._tabArmures = valeur;}
	set tabMonstres(valeur) {this._tabMonstres = valeur;}
	set tabSorts(valeur) {this._tabSorts = valeur;}
	set tabUtilisables(valeur) {this._tabUtilisables = valeur;}
	set tabBackgrounds(valeur) {this._tabBackgrounds = valeur;}
	set autresImages(valeur) {this._autresImages = valeur;}
	set perso(valeur) {this._perso = valeur;}
	set choix(valeur) {this._choix = valeur;}
	set monstreActuel(valeur) {this._monstreActuel = valeur;}
	set etatJeu(valeur) {this._etatJeu = valeur;}
	set etage(valeur) {this._etage = valeur;}
	set dialogues(valeur) {this._dialogues = valeur;}
	set IDobjetTrouve(valeur) {this._IDobjetTrouve = valeur;}
	set typeObjetTrouve(valeur) {this._typeObjetTrouve = valeur;}
	set sons(valeur) {this._sons = valeur;}
	set musiques(valeur) {this._musiques = valeur;}
	set mute(valeur) {this._mute = valeur;}
	set boutique(valeur) {this._boutique = valeur;}
	set texteInfo(valeur) {this._texteInfo = valeur;}
	set selectionCombat(valeur) {this._selectionCombat = valeur;}

	async chargementJSON(chemin) {
		const reponse = await fetch(chemin);
		const tab = await reponse.json();
		return tab;
	}

	async chargerLesJSON() {
		// charger tous les json ici dans un tableau
		this.tabArmes = await this.chargementJSON('./bdd/Armes.json');
		this.tabArmures = await this.chargementJSON('./bdd/Armures.json');
		this.tabMonstres = await this.chargementJSON('./bdd/Monstres.json');
		this.tabSorts = await this.chargementJSON('./bdd/Sorts.json');
		for (let i = 0; i < this.tabSorts.length; i++) {
			//transformation des objets json en Sorts
			this.tabSorts[i] = new sort.Sort(this.tabSorts[i]);
		}
		this.tabUtilisables = await this.chargementJSON('./bdd/Utilisables.json');
		for (let i = 0; i < this.tabUtilisables.length; i++) {
			//transformation des objets json en Utilisable
			this.tabUtilisables[i] = new utilisable.Utilisable(this.tabUtilisables[i]);
		}

		this.tabBackgrounds = await this.chargementJSON('./bdd/Fonds.json');
		this.chargerLesImages();
		this.chargerLesSons();
	}

	chargerLesImages() {
		for (let i of this.tabMonstres) {
			i.img = this.ig.chargerImage(i.cheminImg, this.chargementCB.bind(this));
		}
		for (let i of this.tabBackgrounds) {
			i.img = this.ig.chargerImage(i.cheminImg, this.chargementCB.bind(this));
		}
		this.autresImages.setIcones = this.ig.chargerImage('./elements/images/system/IconSet.png', this.chargementCB.bind(this));
		this.autresImages.ecranTitre = this.ig.chargerImage('./elements/images/ecran_titre/menuV1.png', this.chargementCB.bind(this));
		this.autresImages.boiteTexte = this.ig.chargerImage('./elements/images/system/textBox.png', this.chargementCB.bind(this));
		this.autresImages.boiteTexteVerticale = this.ig.chargerImage('./elements/images/system/textBoxVerticale.png', this.chargementCB.bind(this));
		this.autresImages.curseurMenu = this.ig.chargerImage('./elements/images/system/CursorRight.png', this.chargementCB.bind(this));
		this.autresImages.pnj = this.ig.chargerImage('./elements/images/vendeur/Package2_2.png', this.chargementCB.bind(this));
		this.autresImages.curseurH = this.ig.chargerImage('./elements/images/system/CursorH.png', this.chargementCB.bind(this));
		this.autresImages.curseurB = this.ig.chargerImage('./elements/images/system/CursorB.png', this.chargementCB.bind(this));
		this.autresImages.curseurD = this.ig.chargerImage('./elements/images/system/CursorD.png', this.chargementCB.bind(this));
		this.autresImages.curseurG = this.ig.chargerImage('./elements/images/system/CursorG.png', this.chargementCB.bind(this));
		this.autresImages.curseurRH = this.ig.chargerImage('./elements/images/system/CursorRH.png', this.chargementCB.bind(this));
		this.autresImages.curseurRB = this.ig.chargerImage('./elements/images/system/CursorRB.png', this.chargementCB.bind(this));
		this.autresImages.curseurRD = this.ig.chargerImage('./elements/images/system/CursorRD.png', this.chargementCB.bind(this));
		this.autresImages.curseurRG = this.ig.chargerImage('./elements/images/system/CursorRG.png', this.chargementCB.bind(this));
	}

	chargerLesSons()
	{
		this.musiques.musiqueIntro = new Audio("./elements/son/musiques/ambiance/Theme2.m4a");
		this.musiques.exploration = new Audio("./elements/son/musiques/ambiance/Scene5.m4a");
		this.musiques.musiqueMonstre = new Audio("./elements/son/musiques/combat/Battle1.m4a");
		this.musiques.fin = new Audio("./elements/son/musiques/victoire/VictoryLoop1.m4a");
		this.musiques.boutique = new Audio("./elements/son/musiques/boutique/Town2.m4a");

		this.sons.curseur = new Audio("./elements/son/effets_sonores/Cursor3.m4a");
		this.sons.decision = new Audio("./elements/son/effets_sonores/Decision5.m4a");
		this.sons.deplacer = new Audio("./elements/son/effets_sonores/Move10.m4a");
		this.sons.attaque = new Audio("./elements/son/effets_sonores/Blow8.m4a");
		this.sons.sort = new Audio("./elements/son/effets_sonores/Magic9.m4a");
		this.sons.objet = new Audio("./elements/son/effets_sonores/Heal6.m4a");

		musique.changerSon(this.sons, 0.1); 
		musique.changerSon(this.musiques, 0.2); 
	}

	chargementCB() {
		if (this.ig.chargementComplete()) {
			//debut du jeu
			this.debutPartie();
		}
	}

//  -----------------
//  |  |    IN    | |
//  |  v   GAME   v |
//  -----------------

	debutPartie() {
		this.etatJeu = "menu";

		//a chaque nouvel étage !!
		this.boutique.reload(this.tabUtilisables);
		this.texteInfo = "";

		document.addEventListener("keydown", this.touchePressee.bind(this));
		refreshID = setInterval(this.actualiser.bind(this), 33);
	}

	combat() {
		this.dialogues = histoire.dialoguesCombat;
		this.idMonstreActuel = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
		this.monstreActuel = new monstre.Monstre(this.tabMonstres[this.idMonstreActuel].id, this.tabMonstres[this.idMonstreActuel].nom, this.tabMonstres[this.idMonstreActuel].attaque, this.tabMonstres[this.idMonstreActuel].critique, this.tabMonstres[this.idMonstreActuel].esquive, this.tabMonstres[this.idMonstreActuel].defense, this.tabMonstres[this.idMonstreActuel].pv, this.tabMonstres[this.idMonstreActuel].experience, this.tabMonstres[this.idMonstreActuel].cheminImg, this.tabMonstres[this.idMonstreActuel].musique)
		this.html.remplirMonstre(this.monstreActuel);
		this.etatJeu = "debutCombat";
		this.musiques.musiqueMonstre.src=this.monstreActuel.musique;
		this.posCombat	= 0;
	}


	texte(t) {
		this.ig.afficherTexte(t, this.autresImages.boiteTexte);
	}


	creationListeObjet()
    {
        this.listeObjetPoss = []
        for (let i in this.perso.objets)
        {
            if (this.perso.objets[i] > 0)
            {
                this.listeObjetPoss.push(i);
            }
        }
    }


	getSortFromName(name)
	{
        //recherche de le sort
        for (let j = 0; j < this.tabSorts.length; j++) 
        {
            if(this.tabSorts[j].nom == name)
            {
                return this.tabSorts[j];
                break;
            }
        }
		return null;
	}

	affichageCombatSelectionObjet()
	{
        let XDepart = 15;
        let YDepart = 15;
        let boiteTexteVerticale = this.autresImages.boiteTexteVerticale;
        let imgItems = this.autresImages.setIcones;
        let imgCurseur = this.autresImages.curseurRG;


        this.ig.afficherImage(boiteTexteVerticale, XDepart, YDepart);
	    this.ig.afficherImage(this.tabMonstres[this.idMonstreActuel].img, 1080/2 + (1080/2 - this.tabMonstres[this.idMonstreActuel].img.width)/2, (720 - this.tabMonstres[this.idMonstreActuel].img.height)/2);
        this.texte("Choisissez un objet a utiliser ! ([ESC] pour quitter)");
        let nbItems = this.listeObjetPoss.length;

        for (let i = 0; i < nbItems ; i++)
        {
            let nom = this.listeObjetPoss[i];
            let item;

            //recherche de l'item
            for (let j = 0; j < this.tabUtilisables.length; j++) 
            {
                if(this.tabUtilisables[j].nom == nom)
                {
                    item = this.tabUtilisables[j];
                    break;
                }
            }

            let coord = item.carreIcone();
            let sx = coord[0];
            let sy = coord[1];
            let sLargeur = coord[2];
            let sHauteur = coord[2];
            let dLargeur = 70;
            let dHauteur = 70;
            let dx = XDepart + boiteTexteVerticale.width/5 - dLargeur/2;
            let dy = YDepart + boiteTexteVerticale.height/nbItems*(i+1) - (boiteTexteVerticale.height/nbItems)/2 - dHauteur/2;

            //affichage curseur & selection
            if(i+1 == this.choix)
            {
                //curseur
                let dx = XDepart + boiteTexteVerticale.width + 10;
                let dy = YDepart + (boiteTexteVerticale.height/nbItems*(i+1))-boiteTexteVerticale.height/nbItems/2 - imgCurseur.height/2;
                this.ig.afficherImage(imgCurseur, dx, dy);

                //selection
                this.ig.ctx.globalAlpha = 0.3;
                let marge = 10;
                this.ig.ctx.fillStyle = 'rgb(228,240,142)';
                let x = XDepart + marge; 
                let y = YDepart + boiteTexteVerticale.height/nbItems*i + marge; 
                dx = boiteTexteVerticale.width - marge*2; 
                dy = boiteTexteVerticale.height/nbItems - marge*2; 
                this.ig.ctx.fillRect(x, y, dx, dy);

                this.ig.ctx.globalAlpha = 1.0;
            }

            //affichage img
            this.ig.ctx.drawImage(imgItems, sx, sy, sLargeur, sHauteur, dx, dy, dLargeur, dHauteur);
            
            //affichage titre
            this.ig.afficherTexteTitre(item.nom,dx,dy+dHauteur+20,dLargeur);

            //affichage description
            let margeY = 15;
            dx = XDepart + boiteTexteVerticale.width/5*2;
            dy = YDepart + boiteTexteVerticale.height/nbItems*i;
            this.ig.afficherTexteDansRectangle(item.description,dx,dy+margeY,boiteTexteVerticale.width*2/5,boiteTexteVerticale.height/nbItems);
        
            //affichage quantité
            dx = XDepart + boiteTexteVerticale.width/5*4;
            dy = YDepart + boiteTexteVerticale.height/nbItems*i;
            this.ig.afficherQuantite(this.perso.objets[nom], dx, dy+margeY, boiteTexteVerticale.width/5,boiteTexteVerticale.height/nbItems)

        }
	}


	affichageCombatSelectionSort()
	{
        let XDepart = 15;
        let YDepart = 15;
        let boiteTexteVerticale = this.autresImages.boiteTexteVerticale;
        let imgItems = this.autresImages.setIcones;
        let imgCurseur = this.autresImages.curseurRG;


        this.ig.afficherImage(boiteTexteVerticale, XDepart, YDepart);
	    this.ig.afficherImage(this.tabMonstres[this.idMonstreActuel].img, 1080/2 + (1080/2 - this.tabMonstres[this.idMonstreActuel].img.width)/2, (720 - this.tabMonstres[this.idMonstreActuel].img.height)/2);
        this.texte(this.texteInfo + "Choisissez un sort a utiliser ! ([ESC] pour quitter)");
        let nbItems = this.perso.sorts.length;

        for (let i = 0; i < nbItems ; i++)
        {
            let nom = this.perso.sorts[i];
            let sort;

            //recherche de le sort
            for (let j = 0; j < this.tabSorts.length; j++) 
            {
                if(this.tabSorts[j].nom == nom)
                {
                    sort = this.tabSorts[j];
                    break;
                }
            }

            let coord = sort.carreIcone();
            let sx = coord[0];
            let sy = coord[1];
            let sLargeur = coord[2];
            let sHauteur = coord[2];
            let dLargeur = 70;
            let dHauteur = 70;
            let dx = XDepart + boiteTexteVerticale.width/5 - dLargeur/2;
            let dy = YDepart + boiteTexteVerticale.height/nbItems*(i+1) - (boiteTexteVerticale.height/nbItems)/2 - dHauteur/2;

            //affichage curseur & selection
            if(i+1 == this.choix)
            {
                //curseur
                let dx = XDepart + boiteTexteVerticale.width + 10;
                let dy = YDepart + (boiteTexteVerticale.height/nbItems*(i+1))-boiteTexteVerticale.height/nbItems/2 - imgCurseur.height/2;
                this.ig.afficherImage(imgCurseur, dx, dy);

                //selection
                this.ig.ctx.globalAlpha = 0.3;
                let marge = 10;
                this.ig.ctx.fillStyle = 'rgb(228,240,142)';
                let x = XDepart + marge; 
                let y = YDepart + boiteTexteVerticale.height/nbItems*i + marge; 
                dx = boiteTexteVerticale.width - marge*2; 
                dy = boiteTexteVerticale.height/nbItems - marge*2; 
                this.ig.ctx.fillRect(x, y, dx, dy);

                this.ig.ctx.globalAlpha = 1.0;
            }

            //affichage img
            this.ig.ctx.drawImage(imgItems, sx, sy, sLargeur, sHauteur, dx, dy, dLargeur, dHauteur);
            
            //affichage titre
            this.ig.afficherTexteTitre(sort.nom,dx,dy+dHauteur+20,dLargeur);

            //affichage description
            let margeY = 15;
            dx = XDepart + boiteTexteVerticale.width/5*2;
            dy = YDepart + boiteTexteVerticale.height/nbItems*i;
            this.ig.afficherTexteDansRectangle(sort.description,dx,dy+margeY,boiteTexteVerticale.width*2/5,boiteTexteVerticale.height/nbItems);
        	
            //affichage degats
            dx = XDepart + boiteTexteVerticale.width/5*4;
            dy = YDepart + boiteTexteVerticale.height/nbItems*i;
            this.ig.afficherDegats(sort.degats, dx, dy+margeY, boiteTexteVerticale.width/5,boiteTexteVerticale.height/nbItems)

            //affichage mana
            dx = XDepart + boiteTexteVerticale.width/5*4;
            dy = YDepart + boiteTexteVerticale.height/nbItems*i;
            this.ig.afficherMana(sort.cout, dx, dy+margeY, boiteTexteVerticale.width/5,boiteTexteVerticale.height/nbItems)

        }
	}


	actualiser() {
        switch (this.etatJeu) {
            case "menu":
            	//this.musiques.musiqueIntro.play();
                this.ig.afficherImage(this.autresImages.ecranTitre,0,0,true,true);
                this.ig.afficherImage(this.autresImages.curseurMenu, 280, 395)
                break;
            case "horsCombat":
            	this.musiques.exploration.play();
                this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
                this.texte("Ou voulez-vous donc aller maintenant ?");
                this.ig.drawFleches(this);
                break;
            case "intro":
            	this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
            	this.ig.afficherImage(this.autresImages.pnj, 540, 112);
            	this.texte(this.dialogues[0]);
                break;
            case "debutCombat":
            	this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
            	this.ig.afficherImage(this.tabMonstres[this.idMonstreActuel].img, (1080 - this.tabMonstres[this.idMonstreActuel].img.width)/2, (720 - this.tabMonstres[this.idMonstreActuel].img.height)/2);
            	this.texte(this.dialogues[0]);
            	break;
            case "combat":
           		this.musiques.musiqueMonstre.play();
            	this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
	            if(this.selectionCombat == "")
            	{
		            this.ig.afficherImage(this.autresImages.boiteTexte,0,550);
	            	this.ig.afficherImage(this.tabMonstres[this.idMonstreActuel].img, (1080 - this.tabMonstres[this.idMonstreActuel].img.width)/2, (720 - this.tabMonstres[this.idMonstreActuel].img.height)/2);

	            	this.ig.afficherTexteDansRectangle("ATTAQUER (ARME)", 100, 540, 200, 200);
	            	this.ig.afficherTexteDansRectangle("UTILISER SORT", 500, 540, 200, 200);
	            	this.ig.afficherTexteDansRectangle("UTILISER OBJET", 900, 540, 200, 200);

	            	if(this.posCombat == 0)
	            	{
						this.ig.afficherImage(this.autresImages.curseurRD,60,600);
					}
					if(this.posCombat == 1)
	            	{
						this.ig.afficherImage(this.autresImages.curseurRD,455,600);
					}
					if(this.posCombat == 2)
	            	{
						this.ig.afficherImage(this.autresImages.curseurRD,855,600);
					}
            	}
            	else if (this.selectionCombat == "sort")
            	{
            		this.affichageCombatSelectionSort();
            	}
            	else if (this.selectionCombat == "objet")
            	{
            		this.affichageCombatSelectionObjet();
            	}

				this.html.remplirMonstre(this.monstreActuel);
				//console.log(this.monstreActuel.pv);
				break;
			case "pauseCombat":
				this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
				this.ig.afficherImage(this.tabMonstres[this.idMonstreActuel].img, (1080 - this.tabMonstres[this.idMonstreActuel].img.width)/2, (720 - this.tabMonstres[this.idMonstreActuel].img.height)/2);
				this.texte(this.dialogues[0]);
				break;
			case "finCombat":
				this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
				this.ig.afficherImage(this.autresImages.pnj, 540, 112);
				this.texte(this.dialogues[0]);
				break;
			case "mort":
				this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
				this.ig.afficherImage(this.autresImages.pnj, 540, 112);
				this.texte(this.dialogues[0]);
				break;
            case "salleBoutique":
                this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
                this.texte("Appuyez sur B pour entrer dans la boutique!");
            	this.ig.afficherImage(this.autresImages.pnj, 540, 112);
                this.ig.drawFleches(this);
                break;

            case "boutique":
            	this.musiques.boutique.play();
            	this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
            	this.ig.afficherImage(this.autresImages.pnj, 540, 112);
                this.texte(this.texteInfo + "Choisissez un item! (ESC pour quitter)");
                this.boutique.selection = this.choix;
                this.boutique.afficherBoutique(this.ig, this.autresImages, this.tabUtilisables);
            	break;

            case "salleCoffre":
            	this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
            	this.ig.ctx.drawImage(this.autresImages.setIcones, 2*32, 13*32, 32, 32, 450, 270, 128, 128);
            	this.texte("Appuyez sur C pour ouvrir le coffre.");
            	this.ig.drawFleches(this);
            	break;
            case "coffre":
            	if (this.typeObjetTrouve == "utilisable") {
	            	this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
	            	this.texte(this.dialogues);
	            	this.ig.ctx.drawImage(this.autresImages.setIcones, this.tabUtilisables[this.IDobjetTrouve].icone[0]*32, this.tabUtilisables[this.IDobjetTrouve].icone[1]*32,  32, 32, 450, 270, 128, 128);
	            }
	            else if (this.typeObjetTrouve == "sort") {
	            	this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
	            	this.texte(this.dialogues);
	            	this.ig.ctx.drawImage(this.autresImages.setIcones, this.tabSorts[this.IDobjetTrouve].icone[0]*32, this.tabSorts[this.IDobjetTrouve].icone[1]*32,  32, 32, 450, 270, 128, 128);
	            }
	            else if (this.typeObjetTrouve == "arme") {
	            	this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
	            	this.texte(this.dialogues[0]);
	            	this.ig.ctx.drawImage(this.autresImages.setIcones, this.tabArmes[this.IDobjetTrouve].icone[0]*32, this.tabArmes[this.IDobjetTrouve].icone[1]*32,  32, 32, 450, 270, 128, 128);
	            	if (this.dialogues.length == 1) {
	            		this.ig.afficherTexteLibre("oui                    non", 350, 665);
	            		if (this.choix == 1) {
	            			this.ig.ctx.drawImage(jeu.autresImages.curseurRD,320,640,19,30);
	            		}
	            		else {
	            			this.ig.ctx.drawImage(jeu.autresImages.curseurRD,615,640,19,30);
	            		}
	            	}
	            }
            	break;

        	case "sortie":
        		this.musiques.fin.play();
            	this.ig.afficherImage(this.tabBackgrounds[3].img,0,0,true,true);
            	this.ig.afficherImage(this.autresImages.pnj, 540, 112);
            	this.texte("Vous avez trouve la sortie ! Bravo !");
        		break;
		}
	}


    touchePressee(e) {
    	switch (e.code) {

    		case 'Semicolon' :
    			if (this.mute == 0)
    			{
    				this.mute = 1; 
    				musique.mute(this.musiques); 
    			}
    			else 
    			{
    				this.mute = 0;
    				musique.unmute(this.musiques);
    			}
    			break;

    		case 'Enter':
    			if (this.etatJeu == "menu") {
    				this.sons.decision.play()
					this.etage = new etage.Etage(1, 3, 3, 3, 2, 1);
					this.etage.afficherMap();
					this.dialogues = histoire.dialoguesIntro;
					this.etatJeu = "intro";
				}
				//-----------------------------------------------------
				else if (this.etatJeu == "intro") {
					this.sons.curseur.play();
					if (this.dialogues.length > 1) {
						this.dialogues = this.dialogues.slice(1);
					}
					else {
						this.html = new affichageHTML.AffichageHTML();
						this.html.remplirPerso(this.perso);
						musique.pause(this.musiques);
						this.perso.arme = this.tabArmes[0];
						this.etatJeu = "horsCombat";
					}
				}
				//-----------------------------------------------------
				else if ((this.etatJeu == "horsCombat" || this.etatJeu == "salleCoffre" || this.etatJeu == "salleBoutique") && this.choix != 0) {
					this.sons.deplacer.play()
					this.etage.ajoutTokenMap(this.etage.position[1], this.etage.position[0]);
					this.etage.deplacement(this.choix);
					musique.pause(this.musiques);
					this.etage.actualiserMap();
					this.choix = 0;

					switch (this.etage.salle()) {
						case 's':

							this.etatJeu = "sortie";
							break;
						case 'b':

							this.etatJeu = "salleBoutique";
							break;
						case 'm':

							this.combat();
							break;
						case 't':
							this.etatJeu = "salleCoffre";
							break;
						case 'e':

							this.etatJeu = "horsCombat";
							break;
						case 'r':

							this.etatJeu = "horsCombat";
							break;
					}

				}
				//-----------------------------------------------------
				else if (this.etatJeu == "debutCombat") {
					this.sons.curseur.play();
					if (this.dialogues.length > 1) {
						this.dialogues = this.dialogues.slice(1);
					}
					else
					{	
						musique.pause(this.musiques);	
						this.etatJeu="combat"; 	
					}
				}
				else if(this.etatJeu == "combat")
				{
					// --- utilisation d'ARME en combat
					if(this.posCombat == 0)
					{
						this.sons.attaque.play();
						this._perso.utiliserArme(this.monstreActuel);
						this.monstreActuel.attaquer(this._perso);
					}

					// --- utilisation de SORTS en combat
					else if(this.posCombat == 1 && this.selectionCombat == "")
					{
						this.sons.curseur.play();
						this.selectionCombat = "sort";
						this.choix = 1;
					}
					else if (this.posCombat == 1 && this.selectionCombat == "sort")
					{			
						this.sons.sort.play();			
						let indiceSort = this.choix-1;
						let nomSort = this.perso.sorts[this.choix-1];
						let sort = this.getSortFromName(nomSort);
						if(this.perso.mana - sort.cout >= 0)
						{
							// utiliser sort
							this.perso.utiliserSort(sort,this.monstreActuel);

							// fermer l'inventaire
							this.selectionCombat = "";
							this.posCombat = 0;

							//reload le perso
							this.html.remplirPerso(this.perso);
							this.html.remplirMonstre(this.monstreActuel);
							this.monstreActuel.attaquer(this._perso);
						}
						else
						{
							this.texteInfo = "Mana infussitanse ! ";
						}
					}

					// --- utilisation d'OBJETS en combat
					else if(this.posCombat == 2 && this.selectionCombat == "")
					{
						this.sons.curseur.play();
						this.selectionCombat = "objet";
						this.creationListeObjet();
						this.choix = 1;
					}
					else if (this.posCombat == 2 && this.selectionCombat == "objet")
					{		
						this.sons.objet.play();				
						let item = this.listeObjetPoss[this.choix-1];

						// utiliser objet
						this.perso.utiliser(item);

						// supprimer objet
						this.perso.objets[item]--;

						//maj perso inventaire
						this.perso.actualiserInventaire();

						// fermer l'inventaire
						this.selectionCombat = "";
						this.posCombat = 0;

						//reload le perso
						this.html.remplirPerso(this.perso);
						this.monstreActuel.attaquer(this._perso);
					}


					
					this.html.remplirPerso(this.perso);
					this.html.remplirMonstre(this.monstreActuel);

					if(this.monstreActuel.pv <= 0)
					{
						this.etage.carte[this.etage.position[1]][this.etage.position[0]] = 'r';
						this.dialogues = histoire.dialoguesFinCombat;
						this.html.resetMonstre();
						this.etatJeu	= "finCombat";
						this.perso.economie += 10;
						this.html.remplirPerso(this.perso);
					}
					else if(this._perso.pv <= 0)
					{
						this.etage.carte[this.etage.position[1]][this.etage.position[0]] = 'r';
						this.dialogues = histoire.dialoguesMort;
						this.etatJeu = "mort";
					}
					else if(this.selectionCombat == "")
					{
						this.dialogues = histoire.dialoguesPauseCombat;
						this.etatJeu	= "pauseCombat"
					}
					

				}
				else if(this.etatJeu == "pauseCombat")
				{
					if (this.dialogues.length > 1) {
						this.dialogues = this.dialogues.slice(1);
					}
					else
					{	
						musique.pause(this.musiques);	
						this.etatJeu="combat"; 	
					}					
				}
				else if(this.etatJeu == "finCombat")
				{
					if (this.dialogues.length > 1) {
						this.dialogues = this.dialogues.slice(1);
					}
					else
					{	
						musique.pause(this.musiques);	
						this.etatJeu="horsCombat"; 	
					}					
				}
				else if(this.etatJeu == "mort")
				{
					if (this.dialogues.length > 1) {
						this.dialogues = this.dialogues.slice(1);
					}				
				}				
				//-----------------------------------------------------
				else if (this.etatJeu == "boutique" && this.boutique.prixSelection(this.tabUtilisables) != null)
				{
					let prixSelection = this.boutique.prixSelection(this.tabUtilisables);
					if(this.perso.economie >= prixSelection)
					{
						let item = this.boutique.achat(this.tabUtilisables);
						this.perso.economie -= prixSelection;
						this.html.remplirPerso(this._perso);
						this.perso.objets[item.nom] += 1;
						//console.log(item);
						this.perso.ajoutObjet(item);
						this.texteInfo = "Vous avez achete 1 " + item.nom + "!                     ";
					}
					else
					{
						this.texteInfo = "Vous n' avez pas assez d' argent! ";
					}
				}
				//-----------------------------------------------------
				else if (this.etatJeu == "coffre") {
					if (this.typeObjetTrouve == "utilisable") {
						this.etatJeu = "horsCombat";
					}
					else if (this.typeObjetTrouve == "sort") {
						this.etatJeu = "horsCombat";
					}
					else if (this.typeObjetTrouve == "arme") {
						if (this.dialogues.length > 1) {
						this.dialogues = this.dialogues.slice(1);
						this.choix = 1;
						}
						else {
							if (this.choix == 1) {
								this.perso.arme = this.tabArmes[this.IDobjetTrouve];
							}
							this.choix = 0;
							this.etatJeu = "horsCombat";
						}
					}
				}
				break;


			case 'KeyB':
				if(this.etatJeu == "salleBoutique")
				{
					this.etatJeu = "boutique";
					//select le 1er element de la boutique
					this.choix = 1;
				}
				break;

			case 'KeyC':
				if (this.etatJeu == "salleCoffre") {
					let N = Math.ceil(Math.random() * 100); //60% utilisable, 15% arme/sort, 10% monstre
					if (N <= 60) {
						let R = Math.floor(Math.random() * 6);
						this.typeObjetTrouve = "utilisable";
						this.IDobjetTrouve = R;
						this.perso.objets[this.tabUtilisables[R].nom] += 1;
						this.perso.ajoutObjet(this.tabUtilisables[R]);
						this.etatJeu = "coffre";
						this.dialogues = histoire.dialoguesUtilisables[R];
					}
					else if (N <= 80) {
						let R = Math.floor(Math.random() * 3);
						this.typeObjetTrouve = "sort";
						this.IDobjetTrouve = R;
						if (this.perso.sorts.length == 0) {
							this.perso.sorts.push(this.tabSorts[R].nom);
						}
						else {
							let existe = false;
							for (let i of this.perso.sorts) {
								if (i == this.tabSorts[R].nom)
									existe = true;
							}
							if (existe == false) {
								this.perso.sorts.push(this.tabSorts[R].nom);
							}
						}
						this.etatJeu = "coffre";
						this.dialogues = histoire.dialoguesSorts[R];
					}
					else if (N <= 100) {
						let R = Math.ceil(Math.random() * 1);
						this.typeObjetTrouve = "arme";
						this.IDobjetTrouve = R;
						this.etatJeu = "coffre";
						this.dialogues = histoire.dialoguesArmes[R-1];
					}
					else {
						//fonctionnalité pas encore developpée
						// console.log("MONSTRE");
						/*let R = Math.ceil(Math.random() * 1);
						this.typeObjetTrouve = "arme";
						this.IDobjetTrouve = R;
						this.etatJeu = "coffre";
						this.dialogues = histoire.dialoguesArmes[R-1];*/
					}
					this.etage.carte[this.etage.position[1]][this.etage.position[0]] = 'r'; // <=> coffre ouvert
				}
				break;

			case 'Escape':
                if(this.etatJeu == "boutique")
                {
                    this.etatJeu = "salleBoutique";
                    this.choix = 0;
                }
                else if(this.selectionCombat != "")
                {
                    this.choix = 0; 
                    this.selectionCombat = ""; 
                }
				break;

    		case 'ArrowUp':
    			clavier.selectArrow(this, 'U');
    			break;
    		case 'ArrowRight':
    			clavier.selectArrow(this, 'R');
    			break;
    		case 'ArrowDown':
    			clavier.selectArrow(this, 'D');
    			break;
    		case 'ArrowLeft':
    			clavier.selectArrow(this, 'L');
    			break;
    	}
	}
}

const jeu = new Jeu();





