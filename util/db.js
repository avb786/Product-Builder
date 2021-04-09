const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://dbavb786:Avb@90333@taskmanager-e8bqy.mongodb.net/mono-examples?retryWrites=true&w=majority')
    .then(client => {
    console.debug('Db Connected Suucessfully');
    _db = client.db();
    callback()
    })
    .catch(err => {
    console.error('Error in DB Connection',err);
    })
}

const getDb =() => {
    if(_db) {
        return _db
    } 
    throw 'No Data conected'
}

module.exports = {
    mongoConnect,
    getDb
};