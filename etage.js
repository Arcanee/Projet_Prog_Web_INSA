export class Etage {
    
    constructor(num, longueur, largeur, nbMonstres, nbTresors, nbBoutiques)
    {
        this._num = num;
        this._longueur = longueur; 
        this._largeur = largeur; 
        let carte = creationEtage(longueur, largeur, nbMonstres, nbTresors, nbBoutiques);
        this._carte = carte.etage;
        this._position = carte.coord;
        this._positionDepart = this._position;
    }

    get num() {return this._num; }
    get carte() {return this._carte; }
    get position() {return this._position;}
    get longueur() {return this._longueur;}
    get largeur() {return this._largeur;}

    set num(valeur) {this._num = valeur;}
    set carte(valeur) {this._carte = valeur;}
    set position(valeur) {this._position = valeur;}
    set longueur(valeur) {this._longueur = valeur;}
    set largeur(valeur) {this._largeur = valeur;}

    salle() {
    	return this.carte[this.position[1]][this.position[0]];
    }

    sallexy(x,y)
    {
    	return this.carte[x][y];
    }

    deplacement(choix)
    {
    	const dir = ["haut", "droite", "bas", "gauche"];
    	switch (dir[choix-1])
    	{ 
    	case "haut" :
    		if (this._position[1] == 0)
    		{
    			return "bloque";
    		} 
    		this._position[1] -= 1; 
    		break; 
    	case "bas" : 
    	  if (this._position[1] == this._largeur -1)
    		{
    			return "bloque";
    		} 
    		this._position[1] += 1; 
    		break; 
    	case "droite" :
    	  if (this._position[0] == this._longueur -1)
    		{
    			return "bloque";
    		} 
    		this._position[0] += 1; 
    		break;
    	case "gauche" :
    	  if (this._position[0] == 0)
    		{
    			return "bloque";
    		} 
    		this._position[0] -= 1; 
    		break;  
    	}
    }

    afficherMap()
    {
   
    	const table = document.getElementById("map");
    	const img = new Image; 
    	img.src = "./elements/images/system/perso.png"; 
    	for (let x = 0; x < this.longueur; x++)
		{
			const row =document.createElement("tr");
			for (let y = 0; y < this.largeur; y++)
			{
				const cell = document.createElement("td");
				
				cell.height = '50px';
				cell.width = '50px';
				cell.id = "cell"+x+y;
				if (x==this.position[1] && y==this.position[0] )
				{
					const img = new Image; 
			    	img.src = "./elements/images/system/perso.png"; 
			    	cell.appendChild(img);	
				}
				else 
				{
					cell.bgColor = "Grey";
				}
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
  		
  		table.setAttribute("border", "2");
  	}

  	actualiserMap()
  	{
  		let x=this.position[1]; 
  		let y=this.position[0];
		const cell = document.getElementById("cell"+x+y); 
		const img = new Image;  	
    	img.src = "./elements/images/system/perso.png"; 
    	cell.bgColor = "White";
    	if (cell.childElementCount == 0 )
    	{
		cell.appendChild(img);	
		}
		else 
		{
			cell.removeChild(cell.childNodes[0]); 
			cell.appendChild(img);
		}		

    }

    ajoutTokenMap(x, y)
    {
    	const cell = document.getElementById("cell"+x+y); 
    	const img = new Image;
    	switch (this.sallexy(x,y) )
    	{

    		case 'm' :	
    			img.src = "./elements/images/system/monstre.png"; 
    			break;

    		case 'b' : 
    			img.src = "./elements/images/system/piece.png"; 
    			break;

    		case 't' :
    			img.src = "./elements/images/system/coffre.png";
    			break;
    	}
    	cell.removeChild(cell.childNodes[0]);
    	cell.appendChild(img);
    }

}

function alea(tab) 
{
  let x = Math.floor(Math.random() * tab.length);
  return tab[x]; 
}

function suppPrem(tab, elem)
{
	let i = 0;
	
		while (tab[i]!=elem)
		{
			i++;
		}
		tab[i].remove; 
		tab[i] = tab[tab.length-1]; 
		tab.length = tab.length-1;
		return tab; 
	} 



function creationEtage(longueur, largeur, nbMonstres, nbTresors, nbBoutiques)
{
	//initialisation de l'étage
	let xe, ye; 
	let etage = new Array(longueur);
	let nbVides = longueur*largeur - nbBoutiques - nbTresors - nbMonstres - 2; 
	for (let i = 0; i < longueur; i++)
	{
		etage[i] = new Array(largeur);
	}

	let tabType = ['r', 'm', 't', 'b', 's', 'e'];
	for (let x = 0; x < longueur; x++)
	{
		for (let y = 0; y < largeur; y++)
		{
			
			switch (alea(tabType))
			{
				case 'r':
				etage[y][x] = 'r'; 
				nbVides --;
				if (nbVides == 0)
				{
					suppPrem(tabType, 'r'); 
				}
				break; 

				case 'm':
				etage[y][x] = 'm'; 
				nbMonstres --;
				if (nbMonstres == 0)
				{
					suppPrem(tabType, 'm'); 
				}
				break; 

				case 't':
				etage[y][x] = 't'; 
				nbTresors --;
				if (nbTresors == 0)
				{
					suppPrem(tabType, 't'); 
				}
				break; 
								
				case 'b':
				etage[y][x] = 'b'; 
				nbBoutiques --;
				if (nbBoutiques == 0)
				{
					suppPrem(tabType, 'b'); 
				}
				break; 

				case 'e':
				etage[y][x] = 'e'; 
				xe = x;
				ye = y;

				suppPrem(tabType, 'e'); 
				break; 

				case 's':
				etage[y][x] = 's'; 
				suppPrem(tabType, 's')
				break; 
			}
		}
	}

	return {etage : etage, coord : [xe, ye]};  
}

