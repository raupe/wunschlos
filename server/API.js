/* ==========================================================================================================================================
Implementiert: Ja

Route: /wishlist
HTTP Verb: POST

Beschreibung: Erstellen einer Wunschliste

Rückgabe vom Server: id der Wunschliste als JSON siehe folgende Struktur
*/
{
	publicId: String,	// id für Gäste
	vipId: String		// id für Geburtstagskind
}
/*
Request zum Server: Wishlist als JSON siehe folgende Struktur
*/
{
	title: String,
	to: String,
	items: [
		{
			title: String,
			amount: number,
			unit: String, // €, $, piece (Stück)
			link: String,
			idea: String,
			position: number,
			secret: boolean,
			share: [
				{
					name: String,
					amount: number,
					secret: boolean
    			}
			],
			comments: [
				{
					name: String,
					comment: String,
					secret: boolean
    			}
			]
  		}
	]
}

/* ==========================================================================================================================================
Implementiert: Ja

Route: /wishlist/wishlistId
HTTP Verb: GET

Beschreibung: Anfordern einer Wunschliste

Rückgabe vom Server: die angeforderte Wunschliste als JSON siehe folgende Struktur
Request zum Server: GET request zur richtigen Route
*/
{
	title: String,
	to: String,
	vip: boolean, // dynamisch vom Server je nachdem welcher Link beim GET
	items: [
		{
			_id: String,
			title: String,
			amount: number,
			unit: String, // €, $, piece (Stück)
			link: String,
			idea: String,
			position: number,
			share: [
				{
					_id: String,
					name: String,
					amount: number
    			}
			],
			comments: [
				{
					_id: String,
					name: String,
					comment: String
    			}
			]
  		}
	]
}

/* ==========================================================================================================================================
Implementiert: Ja

Route: /wishlist/wishlistId
HTTP Verb: PUT

Beschreibung: Ändern einer Wunschliste

Rückgabe vom Server: ok || error als String
Request zum Server: Änderungen in JSON siehe folgende Struktur
*/
{
	title: String,
	to: String
}

/* ==========================================================================================================================================
Implementiert: Ja

Route: /wishlist/wishlistId/item
HTTP Verb: POST

Beschreibung: Hinzufügen eines items in einer bestehenden Wunschliste

Rückgabe vom Server: id des items als String
Request zum Server: Item als JSON siehe folgende Struktur
*/
{
	title: String,
	amount: number,
	unit: String, // €, $, piece (Stück)
	link: String,
	idea: String,
	position: number,
	secret: boolean,
	share: [
		{
			name: String,
			amount: number,
			secret: boolean
        }
	],
	comments: [
		{
			name: String,
			comment: String,
			secret: boolean
    	}
	]
}

/* ==========================================================================================================================================
Implementiert: Ja

Route: /wishlist/wishlistId/itemId
HTTP Verb: PUT

Beschreibung: Ändern eines items in einer bestehenden Wunschliste

Rückgabe vom Server: ok || error als String
Request zum Server: Item als JSON siehe folgende Struktur
*/
{
	title: String,
	amount: number,
	unit: String, // €, $, piece (Stück)
	link: String,
	idea: String,
	position: number,
	secret: boolean
}

/* ==========================================================================================================================================
Implementiert: Ja
Route: /wishlist/wishlistId/itemId
HTTP Verb: DELETE

Beschreibung: Löschen eines items in einer bestehenden Wunschliste

Rückgabe vom Server:
Request zum Server: 
*/

/* ==========================================================================================================================================
Implementiert: Ja
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

/* ==========================================================================================================================================
Implementiert: Ja
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

/* ==========================================================================================================================================
Implementiert: Ja
Route: /wishlist/wishlistId/itemId/share/shareId
HTTP Verb: DELETE

Beschreibung: Löschen einer Beteiligung in einer bestehenden Wunschliste

Rückgabe vom Server:
Request zum Server:
*/

/* ==========================================================================================================================================
Implementiert: Ja
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

/* ==========================================================================================================================================
Implementiert: Ja
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

/* ==========================================================================================================================================
Implementiert: Ja
Route: /wishlist/wishlistId/itemId/comment/commentId
HTTP Verb: DELETE

Beschreibung: Löschen eines Kommentars in einer bestehenden Wunschliste

Rückgabe vom Server:
Request zum Server:
*/