
/*======================================================================*/


/*======================================================================*/



// api/services/productService.js
module.exports = {

	processSuit: function(fetched, sent) {
		//Final check:
		// let final_price = sent.base_price;
		// let price = sent.price;
		// for (let p of sent.extra_products) {
		// 	if(p.price >= 0) {
		// 		final_price += p.price;
		// 	} else {
		// 		return "Price Mismatch";
		// 	}
		// }
		// if(final_price === price) {
		// 	fetched.extras = sent.extras;
		// 	fetched.extra_products = sent.extra_products;
		// 	fetched.price = sent.price;
		// 	return fetched;
		// }
		// return "Price Mismatch";
	
		let price = fetched.price;
		let new_product = fetched;
		let extra_products = [];
		// console.log(new_product);
		
		if(sent.extras.pants === null) {
		  price = price * 0.8;
		} else if(sent.extras.extra_pants) {
		  let pants_price = (fetched.price * 0.18) * sent.extras.extra_pants;
		  price = price + pants_price;
		  let extra_pants = {
			  name: "Extra Pants",
			  count: sent.extras.extra_pants,
			  base_price: fetched.price * 0.18,
			  price: pants_price
		  };
		  extra_products.push(extra_pants);
	
		}
		// console.log(extra_products);
	
		//Mockup garment
		if(sent.extras.mockup) {
			let currentPrice = 750;
			let mockup = {
				name: "Mockup Garments",
				count: 1,
				base_price: 750,
				price: 0
			};
			
			if(sent.extras.waistcoat) {
				mockup.name += " + Waistcoat";
				currentPrice += 750 * 0.18;
			}
	
			if(sent.extras.coat) {
				mockup.name += " + Coat";
				currentPrice += 750 * 0.8;
			}
			mockup.price = currentPrice;
			  price += currentPrice;
			extra_products.push(mockup);
		}
		// console.log(extra_products);
	
		//Oversize
		if(sent.extras.oversize) {
		  price +=  fetched.price * 0.06;
		} else if (sent.extras.supersize) {
		  price +=  fetched.price * 0.1;
		}
	
		if(sent.extras.waistcoat) {
		  price += fetched.price * 0.5;
		  let item = {
			  name: "Waistcoat",
			  price: price,
			  base_price: price,
			  count: 1
		  };
		  extra_products.push(item);
		}
		if(sent.extras.coat) {
		  price += fetched.price * 0.9;
		  let item = {
			  name: "Coat",
			  price: price,
			  base_price: price,
			  count: 1
		  };
		  extra_products.push(item);
		}
		// console.log(extra_products);
	
		new_product.price = price;
		new_product.extra_products = extra_products;
		new_product.extras = sent.extras;
		// console.log(new_product);
		return new_product;
	},
}

