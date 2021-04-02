const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);


module.exports = class Cart {
    static addProduct(id, productPrice) {
        // fetch the previos cart
        // Analyze the cart => find existing product 
        fs.readFile(p, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            }
            if (!err) {
                cart = JSON.parse(fileContent)
            }
            // Add new product / Increase the Quantity

            const existingProductsIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProducts = cart.products[existingProductsIndex]
            let updatedProduct;
            if (existingProducts) {
                updatedProduct = { ...existingProducts };
                updatedProduct.qty += 1;
                cart.products = [...cart.products]
                cart.products[existingProductsIndex] = updatedProduct;

            } else {
                updatedProduct = {
                    id: id,
                    qty: 1
                }
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log("Error in Cart", err);
            })
        });

    }

    static deleteProduct(id, productPrice)  {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                return;
            }
            const updatedCart = {...JSON.parse(Buffer(fileContent).toString())};
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice =  updatedCart.totalPrice - productPrice * productQty;
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log("Error in Cart", err);
            })
        })
    }

    static getCart(cb){
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            }
            else {
                cb(cart) 
            }
        })
    }

}