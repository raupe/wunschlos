exports.wishlist = {
	title: String,
	to: String,
	items: [
		{
			title: String,
			amount: Number,
			unit: String,
			link: String,
			idea: String,
			position: Number,
			secret: Boolean,
			shares: [
				{
					name: String,
					amount: Number,
					secret: Boolean
    			}
			],
			comments: [
				{
					name: String,
					comment: String,
					secret: Boolean
    			}
			]
  		}
	]
};