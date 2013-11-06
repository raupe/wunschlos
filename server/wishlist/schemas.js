exports.wishlist = {
	title: String,
	to: String,
	items: [
		{
			id: Number,
			title: String,
			price: Number,
			unit: String,
			link: String,
			idea: String,
			position: 0,
			share: [
				{
					id: Number,
					name: String,
					amount: Number
    			}
			],
			comments: [
				{
					id: Number,
					name: String,
					comment: String
    			}
			]
  		}
	]
};