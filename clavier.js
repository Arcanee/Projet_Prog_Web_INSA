export function selectArrow(jeu, key) {
	switch (key) {


		case 'U':
			if ((jeu.etatJeu == "horsCombat" || jeu.etatJeu == "salleCoffre" || jeu.etatJeu == "salleBoutique") && jeu.etage.position[1] != 0) {
				jeu.sons.curseur.play();
				jeu.choix = 1;
			}
			else if(jeu.etatJeu == "boutique") {
				if(jeu.choix-1 > 0) {
					jeu.choix--;
				}
    		}
            else if (jeu.etatJeu == "combat" && jeu.selectionCombat == "sort")
            {
                if (jeu.choix-1 > 0) 
                    jeu.choix --;
            }

            else if (jeu.etatJeu == "combat" && jeu.selectionCombat == "objet")
            {
                if (jeu.choix-1 > 0) 
                    jeu.choix --;
            }
			else {
				jeu.choix = 0;
			}
			break;


		case 'R':
			if ((jeu.etatJeu == "horsCombat" || jeu.etatJeu == "salleCoffre" || jeu.etatJeu == "salleBoutique") && jeu.etage.position[0] != jeu.etage.longueur-1) {
				jeu.sons.curseur.play();
				jeu.choix = 2;
			}
			else if (jeu.etatJeu == "coffre" && jeu.typeObjetTrouve == "arme") {
				jeu.choix += 1;
				if (jeu.choix == 3) jeu.choix = 1;
			}
			else if (jeu.etatJeu == "combat") {
				if(jeu.posCombat <2) {
					jeu.posCombat +=1;
				}
			}
			else {
				jeu.choix = 0;
			}
			break;


		case 'D':
			if ((jeu.etatJeu == "horsCombat" || jeu.etatJeu == "salleCoffre" || jeu.etatJeu == "salleBoutique") && jeu.etage.position[1] != jeu.etage.largeur-1) {
				jeu.sons.curseur.play();
				jeu.choix = 3;
			}
			else if(jeu.etatJeu == "boutique") {
				if(jeu.choix+1 <= jeu.boutique.listeItems.length) {
					jeu.choix++;
				}
			}
            else if (jeu.etatJeu == "combat" && jeu.selectionCombat == "objet")
            {
                if (jeu.choix < jeu.listeObjetPoss.length) 
                    jeu.choix ++;
            }

            else if (jeu.etatJeu == "combat" && jeu.selectionCombat == "sort")
            {
                if (jeu.choix < jeu.perso.sorts.length) 
                    jeu.choix ++;
            }
			else {
				jeu.choix = 0;
			}
			break;


		case 'L':
			if ((jeu.etatJeu == "horsCombat" || jeu.etatJeu == "salleCoffre" || jeu.etatJeu == "salleBoutique") && jeu.etage.position[0] != 0) {
				jeu.sons.curseur.play();
				jeu.choix = 4;
			}
			else if (jeu.etatJeu == "coffre" && jeu.typeObjetTrouve == "arme") {
				jeu.choix -= 1;
				if (jeu.choix == 0) jeu.choix = 2;
			}
			else if (jeu.etatJeu == "combat") {
				if(jeu.posCombat >0) {
					jeu.posCombat -=1;
				}
			}
			else {
				jeu.choix = 0;
			}
			break;
	}
}