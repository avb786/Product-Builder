const Product = require('../models/product');
const mongodb = require('mongodb')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuth:   req.session.user

  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({title:title, price: price, description: description, imageUrl: imageUrl,userId: req.session.user._id});
  product.save()
    .then(response => {
      console.log("Product added Sussessfull");
      res.redirect('/');
    }).catch(err => {
      console.log("Error in product Save", err)
    })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = Boolean(req.query.edit);
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    if (!product) return res.redirect('/')
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      isAuth:   req.session.user
    });
  }).catch(err => {
    console.log('Error in getEditProduct', err)
  })
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  Product.findById(prodId).then(prod => {
    prod.title = updatedTitle;
    prod.price = updatedPrice;
    prod.imageUrl = updatedImageUrl;
    prod.description = updatedDescription
    return   prod.save()
  }).then((result) => {
    console.log("Updated Product successfully");
    res.redirect('/');
  })
    .catch(err => {
      console.log("Error in updated product");
    })

}

exports.getProducts = (req, res, next) => {
  Product.find()
  .populate('userId')
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuth:   req.session.user
    });
  }).catch(err => {
    console.log("Error in Admin Product Fetch ", err);
  })
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('Product Deleted Successfully');
      res.redirect('/admin/products');
    }).catch(err => console.log("Error in deleting Product", err));
}
