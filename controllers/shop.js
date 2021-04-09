const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');


exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(prod => {
    res.render('shop/product-list', {
      prods: prod,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => {
    console.log('Error in fetch data', err);
  })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((prod) => {
    res.render('shop/product-detail', {
      product: prod,
      pageTitle: prod.title,
      path: '/products'
    })
  }).catch((err) => {
    console.error("Error in getProduct");
  })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(prod => {
    res.render('shop/index', {
      prods: prod,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log('Error in fetch data', err);
  })
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cartProducts => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts
    });
  }).catch(err => {
    console.log("Error in getCart ", err);
  })

};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
 Product.findById(prodId).then(product =>{
   return req.user.addToCart(product)
 }).then(result => {
   console.log("Post cart", result);
   res.redirect('/cart')
 })

}

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then(order => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: order
    });
  })
  .catch(err => {
    console.error("Error in getOrders", err);
  })
 
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postCartDeLeteProduct= (req, res, next) => {
  const productId = req.body.productId;
  
  req.user.deleteItemFromCart(productId)
  .then(cart => {
    console.debug("deleteItemFromCart successfully");
    res.redirect('/cart');
  })
  .catch(err => {
    console.error('Error in postCartDeLeteProduct');
  })
}

exports.postOrder = (req,res, next) => {
  req.user.addOrder()
  .then((result) =>{
    console.log("Order done");
    res.redirect('/orders')
  }).catch(err=> console.log('Error in post order', err))
}

