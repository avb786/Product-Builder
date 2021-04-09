const { getDb } = require('../util/db')
const mongodb = require('mongodb')
class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this).then(result => {
      console.log('User inserted sucessfully', result);
    })
    .catch(err => {
      console.error("Error in inserting user");
    })
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp =>{
      return cp.productId.toString() === product._id.toString();
    })
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]
    if(cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].qty + 1;
      updatedCartItems[cartProductIndex].qty = newQuantity;
    } else {
      updatedCartItems.push({
        productId: mongodb.ObjectID(product._id),
        qty: newQuantity
      })
    }
    const updatedCart = {
      items: updatedCartItems
    }
    const db = getDb();
    db.collection('users').updateOne({_id: mongodb.ObjectID(this._id)}, {
      $set: {cart:updatedCart}
    })
  }

  static findById(id){
    const db = getDb();
    return db.collection('users').findOne({_id: mongodb.ObjectID(id)}).then(user => {
      return user;
    }).catch(err => console.error(err))
  }

  getCart() {
    const db = getDb();
    const productId = this.cart.items.map(item => item.productId)
    return db.collection('products').find({
      _id: {
        $in: productId
      }
    })
    .toArray()
    .then(prod => {
      return prod.map(p => {
        return {
          ...p, qty: this.cart.items.find(i =>{
            return i.productId.toString() === p._id.toString()
          }).qty
        }
      })
    })
    .catch(err=> {
      console.error("get cart user error", err);
    })
  }

  deleteItemFromCart(prodId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== prodId.toString();
    });
    const db = getDb();
    return db.collection('users').updateOne({_id: mongodb.ObjectID(this._id)}, {
      $set: {cart: {items : updatedCartItems}}
    })
  }

  addOrder(){
    const db = getDb();
   return this.getCart().then(prod => {
      const order = {
        items: prod,
        user: {
          _id: new mongodb.ObjectID(this._id),
          name: this.name,
          email: this.email
        }
      }
      return db.collection('orders').insertOne(order)
    }).then(result => {
      this.cart = {items:[]};
      return db.collection('users').updateOne({_id: mongodb.ObjectID(this._id)}, {
        $set: {cart: {items : []}}
      })
    })
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders')
    .find({'user._id': mongodb.ObjectID( this._id)})
    .toArray();

  }
    
}


  module.exports = User;