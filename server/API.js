/*
Route: /wishlist
HTTP Verb: POST

Beschreibung: Erstellen einer Wunschliste

Rückgabe vom Server: id der Wunschliste als String
Request zum Server: Wishlist als JSON siehe folgende Struktur
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
			secret: boolean,
			share: [
				{
					id: number,
					name: String,
					amount: number,
					secret: boolean
    			}
			],
			comments: [
				{
					id: number,
					name: String,
					comment: String,
					secret: boolean
    			}
			]
  		}
	]
}

/*
Route: /wishlist/wishlistId
HTTP Verb: GET

Beschreibung: Anfordern einer Wunschliste
Zum testen über Adresszeile (id nur ein Beispiel hier, als id die id benutzen, die vom Server nach einem POST request zurückgesendet wurde):
http://place2co.de/nodejs/wishlist/527ab38f3c570bb421000004

Rückgabe vom Server: die angeforderte Wunschliste als JSON siehe folgende Struktur
Request zum Server: GET request zur richtigen Route
*/
{
	title: String,
	to: String,
	vip: boolean, // dynamisch vom Server je nachdem welcher Link beim GET
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
Route: /wishlist/wishlistId
HTTP Verb: PUT

Beschreibung: Ändern einer Wunschliste

Rückgabe vom Server:
Request zum Server: Änderungen in JSON siehe folgende Struktur
*/
{
	title: String,
	to: String
}

/*
Route: /wishlist/wishlistId/item
HTTP Verb: POST

Beschreibung: Hinzufügen eines items in einer bestehenden Wunschliste

Rückgabe vom Server: id des items als String
Request zum Server: Item als JSON siehe folgende Struktur
*/
{
	title: String,
	price: number,
	unit: String, // €, $, piece (Stück)
	link: String,
	idea: String,
	position: number,
	secret: boolean,
	share: [
		{
			id: number,
			name: String,
			amount: number,
			secret: boolean
        }
	],
	comments: [
		{
			id: number,
			name: String,
			comment: String,
			secret: boolean
    	}
	]
}

/*
Route: /wishlist/wishlistId/itemId
HTTP Verb: PUT

Beschreibung: Ändern eines items in einer bestehenden Wunschliste

Rückgabe vom Server: ok || error als String
Request zum Server: Item als JSON siehe folgende Struktur
*/
{
	title: String,
	price: number,
	unit: String, // €, $, piece (Stück)
	link: String,
	idea: String,
	position: number,
	secret: boolean
}

/*
Route: /wishlist/wishlistId/itemId
HTTP Verb: DELETE

Beschreibung: Löschen eines items in einer bestehenden Wunschliste

Rückgabe vom Server:
Request zum Server: 
*/

/*
Route: /wishlist/wishlistId/itemId/share
HTTP Verb: POST

Beschreibung: Hinzufügen einer Beteiligung

Rückgabe vom Server: id des shares als String
Request zum Server: Share als JSON siehe folgende Struktur
*/
{
	name: String,
	amount: number,
	secret: boolean
}

/*
Route: /wishlist/wishlistId/itemId/share/shareId
HTTP Verb: PUT

Beschreibung: Ändern einer Beteiligung in einer bestehenden Wunschliste

Rückgabe vom Server: ok || error als String
Request zum Server: Share als JSON siehe folgende Struktur
*/
{
	name: String,
	amount: number,
	secret: boolean
}

/*
Route: /wishlist/wishlistId/itemId/share/shareId
HTTP Verb: DELETE

Beschreibung: Löschen einer Beteiligung in einer bestehenden Wunschliste

Rückgabe vom Server:
Request zum Server:
*/

/*
Route: /wishlist/wishlistId/itemId/comment
HTTP Verb: POST

Beschreibung: Hinzufügen eines Kommentars

Rückgabe vom Server: id des shares als String
Request zum Server: Kommentar als JSON siehe folgende Struktur
*/
{
	name: String,
	comment: String,
	secret: boolean
}

/*
Route: /wishlist/wishlistId/itemId/comment/commentId
HTTP Verb: PUT

Beschreibung: Ändern eines Kommentars in einer bestehenden Wunschliste

Rückgabe vom Server: ok || error als String
Request zum Server: Kommentar als JSON siehe folgende Struktur
*/
{
	name: String,
	comment: String,
	secret: boolean
}

/*
Route: /wishlist/wishlistId/itemId/comment/commentId
HTTP Verb: DELETE

Beschreibung: Löschen eines Kommentars in einer bestehenden Wunschliste

Rückgabe vom Server:
Request zum Server:
*/