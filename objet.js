export class Objet {

    constructor(id, nom, description, icone, animation, prix)
    {
        //le cas où on a mis un seul Object dans le constructeur qui doit
        // etre traduit en un "Objet", il y a donc 1 seul argument
        if(typeof(id) == "object")
        {
            let obj = id;
            this._id = obj.id;
            this._nom = obj.nom;
            this._description = obj.description;
            this._icone = obj.icone;
            this._animation = obj.animation;
            this._prix = obj.prix;
        }
        else
        {
            this._id = id;
            this._nom = nom;
            this._description = description;
            this._icone = icone;
            this._animation = animation;
            this._prix = prix;
        }
    }

    get id() {return this._id; }
    get nom() {return this._nom; }
    get description() {return this._description; }
    get icone() {return this._icone; }
    get animation() {return this._animation; }
    get prix() {return this._prix; }


    set id(valeur) {this._id = valeur;}
    set nom(valeur) {this._nom = valeur;}
    set description(valeur) { this._description = valeur;}
    set icone(valeur) {this._icone = valeur;}
    set animation(valeur) {this._animation = valeur;}
    set prix(valeur) {this._prix = valeur;}


    carreIcone()
    {
    //retourne un tableau avec les coordonnées de l'objet dans l'image(x,y)
    // et la taille de l'icône
      let tailleIcone = 32;
      let coord = [];
      coord.push(this.icone[0]);
      coord.push(this.icone[1]);
      coord[0] = tailleIcone*(coord[0]); 
      coord[1] = tailleIcone*(coord[1]);
      coord.push(tailleIcone);
      return coord; 

    }

}