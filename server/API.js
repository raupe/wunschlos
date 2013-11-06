/*
Route: /wishlist
HTTP Verb: POST

Beschreibung: Erstellen einer Wunschliste

Rückgabe vom Server: id der Wunschliste
Request zum Server: Wishlist als JSON siehe folgende Struktur "var wishlist"
*/
{
	title: String,
	to: String,
	items: [
		{
			id: number,
			title: String,
			price: number,
			unit: String, // €, $, piece (Stück)
			link: String,
			idea: String,
			position: number,
			share: [
				{
					id: number,
					name: String,
					amount: number
    			}
			],
			comments: [
				{
					id: number,
					name: String,
					comment: String
    			}
			]
  		}
	]
}

/*
Route: /wishlist
HTTP Verb: GET

Beschreibung: Anfordern einer Wunschliste
Zum testen über Adresszeile (id nur ein Beispiel hier, als id die id benutzen, die vom Server nach einem POST request zurückgesendet wurde):
http://place2co.de/nodejs/wishlist/wishlist?id=527ab38f3c570bb421000004

Rückgabe vom Server: die angeforderte Wunschliste
Request zum Server: Id der Wunschliste als JSON
*/
{
	id: String
}
