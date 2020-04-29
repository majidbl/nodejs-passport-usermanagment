const Sequelize = require('sequelize');
// Or you can simply use a connection uri
var sequelize = new Sequelize('postgres://majid72bl:5080075066@localhost:5432/mydb', { define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    }});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

var Nuser = sequelize.define('nuser', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fathername: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type:Sequelize.STRING,
    allowNull: false
  },
  identitynumber:{
    type:Sequelize.STRING,
    allowNull: false,
    unique:true
  },
  gender:{
    type:Sequelize.STRING,
    allowNull:false
  },
  birthday:{
    type:Sequelize.DATE,
    allowNull:false
  },
  age:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  password:{
    type:Sequelize.STRING,
    allowNull:false
  },
  role:{
    type:Sequelize.STRING,
    defaultValue:'member'
  }
},{// define the table's name
  tableName: 'nuser'
});



//nuser.findAll().then(function(test) { console.log(test); })
module.exports = Nuser;