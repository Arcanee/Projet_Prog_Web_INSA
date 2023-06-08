async function chargementPolice() {
    const police = new FontFace('maPolice', 'url(MoriaCitadel.TTF)');
    await police.load();
    document.fonts.add(police);
    document.body.classList.add('fonts-loaded');
}
chargementPolice();

export class Graphique
{
    constructor()
    {
        this._canvas = document.getElementById("myCanvas");
        this._ctx = this.canvas.getContext("2d");
        this._chargementImg = new Map();
    }

    get canvas() {return this._canvas;}
    get ctx() {return this._ctx;}
    get chargementImg() {return this._chargementImg;}

    set canvas(valeur) {this._canvas = valeur;}
    set ctx(valeur) {this._ctx = valeur;}
    set chargementImg(valeur) {this._chargementImg = valeur;}

    updateChargementImg(event, callback)
    {
        this.chargementImg.set(event.target.chemin, true);
        callback();
    }

    chargerImage(chemin, callback)
    {
        let img = new Image();
        img.cible = this;
        img.chemin = chemin;
        this.chargementImg.set(chemin, false);
        img.addEventListener("load", () => {this.updateChargementImg(event, callback)});
        img.src = chemin;
        return img;
    }

    afficherImage(img,x,y,aLechelleX=false,aLechelleY=false) {
        if(aLechelleX && aLechelleY)
        {
            this.ctx.drawImage(img,x,y,this.canvas.width,this.canvas.height);
        }
        else if(aLechelleX)
        {
            this.ctx.drawImage(img,x,y,this.canvas.width,img.height);
        }
        else if(aLechelleX)
        {
            this.ctx.drawImage(img,x,y,img.width,this.canvas.height);
        }
        else
        {
            this.ctx.drawImage(img,x,y);
        }
    }

    chargementComplete()
    {
        let result = true;
        for (let [key, value] of this.chargementImg) {
            if (value === false) {
                result = false;
            }
        }
        return result;
    }

    afficherTexte(texte, boite) //53 caracteres par ligne max.
    {
        this.afficherImage(boite, 0, this.canvas.height-160);

        let nbCarac = 53;
        this.ctx.font = "24px maPolice";
        this.ctx.fillStyle = "Black";

        if (texte.length > nbCarac) {
            let texte1 = texte.substr(0, nbCarac);
            let texte2 = texte.substr(nbCarac, texte.length-nbCarac);
            if (texte2[0] == ' ') {texte2 = texte2.substr(1, texte2.length-1);}
            this.ctx.fillText(texte1, 45, 620);
            this.ctx.fillText(texte2, 45, 665);
        }
        else {
            this.ctx.fillText(texte, 45, 620);
        }
    }

    afficherTexteLibre(texte, x, y) {
        this.ctx.font = "24px maPolice";
        this.ctx.fillStyle = "Black";
        this.ctx.fillText(texte, x, y);
    }

    afficherTexteDansRectangle(texte, x, y, w, h)
    {
        let taille = 15;

        let nbCarac = w/(0.52*taille);
        this.ctx.font = taille.toString() + "px Comic Sans MS";
        this.ctx.fillStyle = "Black";
        let txt = [texte];

        while(txt[txt.length - 1].length > nbCarac)
        {
            let tmp = txt[txt.length - 1];
            txt[txt.length - 1] = tmp.substr(0, nbCarac);
            txt.push(tmp.substr(nbCarac, texte.length));
        }
        let nbLignes = txt.length;
        let yStart = y + h/2 - (nbLignes*taille*1.2)/2;

        for (var i = 0; i < nbLignes; i++) {
            this.ctx.fillText(txt[i], x, yStart + i*taille*1.2);
        }
    }

    afficherTexteTitre(titre, x, y, wSupport)
    {
        //wSupport est la largeur de l'item auquel on va mettre un sous-titre
        let taille = 15;
        this.ctx.font = "bold " + taille.toString() + "px Comic Sans MS";

        this.ctx.fillStyle = "Black";
        this.ctx.fillText(titre, x+wSupport/2 - titre.length*(0.52*taille)/2, y);
    }

    afficherPrix(prix, x, y, w, h)
    {
        let taille = 15;

        let text = prix.toString() + " PO";
        //mettre 9 et l'icone de piece a coté au lieu de PO !

        this.ctx.fillStyle = "gold";
        this.ctx.strokeStyle= "brown"; //set the color of the stroke line 
        this.ctx.lineWidth = 3;  //define the width of the stroke line
        this.ctx.font = "bold " + taille.toString() + "px Comic Sans MS"; //set the font name and font size
        
        let dx = x + w/2 - text.length*(0.52*taille)/2;
        let dy = y + h/2 - taille/2;

        this.ctx.strokeText(text,dx,dy); //draw the borders
        this.ctx.fillText(text,dx,dy); //draw the text
    }

    drawFleches(jeu) {
        if (jeu.etage.position[0] != 0) {
            if (jeu.choix != 4) {
                this.afficherImage(jeu.autresImages.curseurG,10,300);
            }
            else {
                this.afficherImage(jeu.autresImages.curseurRG,10,300);
            }
        }
        if (jeu.etage.position[1] != 0) {
            if (jeu.choix != 1) {
                this.afficherImage(jeu.autresImages.curseurH,500,10);
            }
            else {
                this.afficherImage(jeu.autresImages.curseurRH,500,10);
            }
        }
        if (jeu.etage.position[0] != jeu.etage.longueur-1) {
            if (jeu.choix != 2) {
                this.afficherImage(jeu.autresImages.curseurD,1045,300);
            }
            else {
                this.afficherImage(jeu.autresImages.curseurRD,1045,300);    
            }
        }
        if (jeu.etage.position[1] != jeu.etage.largeur-1) {
            if (jeu.choix != 3) {
                this.afficherImage(jeu.autresImages.curseurB,500,520);
            }
            else {
                this.afficherImage(jeu.autresImages.curseurRB,500,520);
            }
        }
    }

    
    afficherQuantite(quantite, x, y, w, h)
    {
        let taille = 15;

        let text = "X " + quantite.toString();

        this.ctx.fillStyle = "gold";
        this.ctx.strokeStyle= "brown"; //set the color of the stroke line 
        this.ctx.lineWidth = 3;  //define the width of the stroke line
        this.ctx.font = "bold " + taille.toString() + "px Comic Sans MS"; //set the font name and font size
        
        let dx = x + w/2 - text.length*(0.52*taille)/2;
        let dy = y + h/2 - taille/2;

        this.ctx.strokeText(text,dx,dy); //draw the borders
        this.ctx.fillText(text,dx,dy); //draw the text
    }

    afficherDegats(degats, x, y, w, h)
    {
        let taille = 15;

        let text = degats.toString();

        this.ctx.fillStyle = "red";
        this.ctx.strokeStyle= "brown"; //set the color of the stroke line 
        this.ctx.lineWidth = 3;  //define the width of the stroke line
        this.ctx.font = "bold " + taille.toString() + "px Comic Sans MS"; //set the font name and font size
        
        let dx = x + w/2 - text.length*(0.52*taille)/2;
        let dy = y + h/3 - taille/2;

        this.ctx.strokeText(text,dx,dy); //draw the borders
        this.ctx.fillText(text,dx,dy); //draw the text
    }
    afficherMana(mana, x, y, w, h)
    {
        let taille = 15;

        let text = mana.toString();

        this.ctx.fillStyle = "cyan";
        this.ctx.strokeStyle= "blue"; //set the color of the stroke line 
        this.ctx.lineWidth = 3;  //define the width of the stroke line
        this.ctx.font = "bold " + taille.toString() + "px Comic Sans MS"; //set the font name and font size
        
        let dx = x + w/2 - text.length*(0.52*taille)/2;
        let dy = y + h*2/3 - taille/2;

        this.ctx.strokeText(text,dx,dy); //draw the borders
        this.ctx.fillText(text,dx,dy); //draw the text
    }
}

// exemple d'utilisation :
//let fond = ig.chargerImage("Book.png");
//ig.afficherImage(fond,0,0,true);