const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Avb@90333', {dialect: 'mysql', host: 'localhost'});


module.exports = sequelize;