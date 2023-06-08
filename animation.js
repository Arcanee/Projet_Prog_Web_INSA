

    animation(img, longueur, largeur, x, y)
    {
    img.onload = function(){
    //les carrés des animations sont de 192*192
    let xmax = longueur/192; 
    let ymax = largeur/192;
    
    for (let i = 0; i<xmax; i++)
    {
        for (let j = 0; j<ymax; j++)
        {
            this.ctx.drawImage(img, i*192, j*192, 192, 192, x, y, 192, 192); 
            sleep(500); 
        }
    }
    }.bind(this);
    }

}