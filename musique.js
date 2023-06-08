export function mute(musiques)
{

	for (let i in musiques)
	{
		musiques[i].volume = 0; 
	}
}

export function changerSon(musiques, vol)
{
	for (let i in musiques)
	{
		musiques[i].volume = vol;  
	}
}

export function unmute(musiques)
{
	for (let i in musiques)
	{
		musiques[i].volume = 0.2;  
	}
}

export function pause(musiques)
{

	for (let i in musiques)
	{
		musiques[i].pause();
	}
}