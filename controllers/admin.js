const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
 Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description, description,
    userId: req.user.id
  })
  .then(response => {
    console.log("Product added Sussessfull");
    res.redirect('/');
  }).catch(err => {
    console.log("Error in product Save", err)
  })
};

exports.getEditProduct = (req, res, next) => {
  console.log(req.query);
  const editMode = Boolean(req.query.edit);
  console.log("Query", editMode);
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId).then( product => {
    if (!product) return res.redirect('/')
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
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
  Product.findByPk(prodId).then(prod => {
    prod.title = updatedTitle;
    prod.price = updatedPrice;
    prod.imageUrl = updatedImageUrl;
    prod.description = updatedDescription;
    return prod.save();
  })
  .then((result) =>{
    console.log("Updated Product successfully");
   res.redirect('/');
  })
  .catch(err => {
    console.log("Error in updated product");
  })
}

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => {
    console.log("Error in Admin Product Fetch ", err);
  })
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(prod => prod.destroy())
  .then(()=>{
    console.log('Product Deleted Successfully');
    res.redirect('/admin/products');
    }).catch(err => console.log("Error in deleting Product", err));
}
