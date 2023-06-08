export class Boutique {
    
    constructor(nbItems, multiplicateurPrix)
    {
        //multiplicateurPrix => ex 0.5 => prix divisés par deux (peut être donné à l'issue d'un combat par exemple)
        this._nbItems = nbItems;
        this._multiplicateurPrix = multiplicateurPrix;
        this._listeItems = [];
        this._selection = 1;
    }

    get nbItems() {return this._nbItems; }
    get multiplicateurPrix() {return this._multiplicateurPrix; }
    get listeItems() {return this._listeItems; }
    get selection() {return this._selection; }

    set nbItems(valeur) {this._nbItems = valeur;}
    set multiplicateurPrix(valeur) {this._multiplicateurPrix = valeur;}
    set listeItems(valeur) {this._listeItems = valeur;}
    set selection(valeur) {this._selection = valeur;}
 
 
    reload(listeItemsPossibles)
    {
        this.listeItems = [];
        for (let i = 0; i < this.nbItems ; i++)
        {
            let n = Math.floor(Math.random() * listeItemsPossibles.length);
            this.listeItems.push(listeItemsPossibles[n].id);
        }
    }

    prixSelection(listeItemsPossibles)
    {
        let id = this.listeItems[this.selection-1];

        //recherche de l'item
        for (let j = 0; j < listeItemsPossibles.length; j++) 
        {
            if(listeItemsPossibles[j].id == id)
            {
                return listeItemsPossibles[j].prix;
                break;
            }
        }
        return null;
    }

    achat(listeItemsPossibles)
    {
        console.log("achat effectue !");
        let i = this.selection-1;
        let idItem = this.listeItems.splice(i,1);
        //recherche de l'item
        let item = "error";
        for (let j = 0; j < listeItemsPossibles.length; j++) 
        {
            if(listeItemsPossibles[j].id == idItem)
            {
                item = listeItemsPossibles[j];
                break;
            }
        }

        this.selection -= 1;
        if(this.selection <= 0)
            this.selection = 1;
        /*
        A faire
        faire en sorte de pouvoir acheter :
            - déduire de l'argent qu'on a 
            - supprimer l'élément de l'échope
            - l'ajouter à l'inventaire
        */
        return item;
    }

    afficherBoutique(ig,img,listeItemsPossibles)
    {
        let XDepart = 15;
        let YDepart = 15;
        let boiteTexteVerticale = img.boiteTexteVerticale;
        let imgItems = img.setIcones;
        let imgCurseur = img.curseurRG;

        ig.afficherImage(boiteTexteVerticale, XDepart, YDepart);
        for (let i = 0; i < this.listeItems.length ; i++)
        {
            let id = this.listeItems[i];
            let item;

            //recherche de l'item
            for (let j = 0; j < listeItemsPossibles.length; j++) 
            {
                if(listeItemsPossibles[j].id == id)
                {
                    item = listeItemsPossibles[j];
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
            let dy = YDepart + boiteTexteVerticale.height/this.nbItems*(i+1) - (boiteTexteVerticale.height/this.nbItems)/2 - dHauteur/2;

            //affichage curseur & selection
            if(i+1 == this.selection)
            {
                //curseur
                let dx = XDepart + boiteTexteVerticale.width + 10;
                let dy = YDepart + (boiteTexteVerticale.height/this.nbItems*(i+1))-boiteTexteVerticale.height/this.nbItems/2 - imgCurseur.height/2;
                ig.afficherImage(imgCurseur, dx, dy);

                //selection
                ig.ctx.globalAlpha = 0.3;
                let marge = 10;
                ig.ctx.fillStyle = 'rgb(228,240,142)';
                let x = XDepart + marge; 
                let y = YDepart + boiteTexteVerticale.height/this.nbItems*i + marge; 
                dx = boiteTexteVerticale.width - marge*2; 
                dy = boiteTexteVerticale.height/this.nbItems - marge*2; 
                ig.ctx.fillRect(x, y, dx, dy);

                ig.ctx.globalAlpha = 1.0;
            }

            //affichage img
            ig.ctx.drawImage(imgItems, sx, sy, sLargeur, sHauteur, dx, dy, dLargeur, dHauteur);
            
            //affichage titre
            ig.afficherTexteTitre(item.nom,dx,dy+dHauteur+20,dLargeur);

            //affichage description
            let margeY = 15;
            dx = XDepart + boiteTexteVerticale.width/5*2;
            dy = YDepart + boiteTexteVerticale.height/this.nbItems*i;
            ig.afficherTexteDansRectangle(item.description,dx,dy+margeY,boiteTexteVerticale.width*2/5,boiteTexteVerticale.height/this.nbItems);
        
            //affichage prix
            dx = XDepart + boiteTexteVerticale.width/5*4;
            dy = YDepart + boiteTexteVerticale.height/this.nbItems*i;
            ig.afficherPrix(item.prix, dx, dy+margeY, boiteTexteVerticale.width/5,boiteTexteVerticale.height/this.nbItems)

        }
    }



}
