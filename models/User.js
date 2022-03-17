const { Model, DataTypes } = require('sequelize');
const bcrypt = require("bcrypt")
const sequelize = require('../config/connection');

// create our User model
class User extends Model {
  // instance method to access password property of each user instance
  checkPassword(loginPw) {
    // this allows us to access user's properties including password stored as a hashed string
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// define table columns and configuration
User.init(
  {
    // define an id column
    id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: DataTypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            // at least four characters long
            len: [4]
        }
    }
  },
  {
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      }, 
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
      // beforeCreate(userData) {
      //   return bcrypt.hash(userData.password, 10).then(newUserData => {
      //     return newUserData
      //   });
      // }
    },
    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

module.exports = User;