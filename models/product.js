const { getDb } = require('../util/db')
const mongodb = require('mongodb')
class Product {
  constructor(title, price, description, imageUrl, id, userId){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id
    this.userId = userId;
  }

  save(){
    const db = getDb();
    let dbOp;
    if(this._id) {
      dbOp = db.collection('products').updateOne({_id: mongodb.ObjectID(this._id) }, {
        $set: this
      })
    } else {
       dbOp = db.collection('products')
      .insertOne(this)
    }
    return dbOp.then(result => {
      console.log('Product inserted sucessfully', result);
    })
    .catch(err => {
      console.error("Error in inserting products");
    })

  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products')
    .find()
    .toArray()
    .then(products => {
      return products;
    })
    .catch(err =>{
      console.log("Error",err);
    });
  }

  static findById(id) {
    const db = getDb();
    return db.collection('products')
    .find({_id : mongodb.ObjectID( id)})
    .next()
    .then(product => {
      return product;
    })
    .catch(err =>{
      console.log("Error",err);
    });
  }

 static deleteById(id) {
const db = getDb();
  return db.collection('products')
  .deleteOne({_id: new mongodb.ObjectID(id)})
  .then(result => {
    console.log('Deleted Product');
  })
  .catch(err =>{
    console.error('Error in Product Deleted', err);
  })
  }
}



module.exports = Product;