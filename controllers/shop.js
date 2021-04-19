const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');


exports.getProducts = (req, res, next) => {
  Product.find().then(prod => {
    res.render('shop/product-list', {
      prods: prod,
      pageTitle: 'All Products',
      path: '/products',
      isAuth: req.session.user
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
      path: '/products',
      isAuth: req.session.user
    })
  }).catch((err) => {
    console.error("Error in getProduct");
  })
}

exports.getIndex = (req, res, next) => {
  Product.find().then(prod => {
    res.render('shop/index', {
      prods: prod,
      pageTitle: 'Shop',
      path: '/',
      isAuth:   req.session.user,
    });
  }).catch(err => {
    console.log('Error in fetch data', err);
  })
};

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
  .execPopulate()
  .then(cartProducts => {
    // console.log("cartProducts %j", cartProducts);
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts.cart.items,
      isAuth:   req.session.user
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
  Order.find({'user.userId': req.session.user._id})
 .then(order => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: order,
      isAuth:   req.session.user
    });
  })
  .catch(err => {
    console.error("Error in getOrders", err);
  })
 
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuth:   req.session.user
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
  req.user.populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items.map(i=> {
      return {
        qty: i.qty,
        product:{ ...i.productId._doc}
      }
    })

    console.log('USERSSR', user);

    const order = new Order({
      user: {
        name: user.email,
        userId: req.session.user
      },
      products:products
    })
    return order.save();
  }) 
  .then((result) =>{
    console.log("Order done");
    return req.user.clearCart()
   
  }).then(() => {
    res.redirect('/orders')
  })
  .catch(err=> console.log('Error in post order', err))
}

