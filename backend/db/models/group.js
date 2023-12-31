'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(models.User, {
        as: "Members",
        through: models.Membership,
        foreignKey: "groupId",
        otherKey: "userId",
      })
      Group.belongsTo(models.User, {
        foreignKey: "organizerId",
      })
      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      })
      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      })
      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      })
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        isLessThan60(value) {
          if (value.length > 60)
            throw new Error("Name must be 60 charactes or less");
        }
      }
    },
    about: {
      type: DataTypes.TEXT,
      validate: {
        isMoreThan50(value) {
          if (value.length < 30) 
            throw new Error("About must be 30 characters or more");
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isExpected(value) {
          if (value != "In person" && value != "Online")
            throw new Error("Type must be 'Online' or 'In person'");
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      validate: {
        isBool(value) {
          if (typeof value != "boolean") 
            throw new Error("Private must be a boolean");
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        isNotEmpty(value) {
          if (value == "")
            throw new Error("City is required");
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        isNotEmpty(value) {
          if (value == "")
            throw new Error("State is required");
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
    scopes: {
      limited: {
        attributes: {
          exclude: ["organizerId", "about", "type", "private", "createdAt", "updatedAt"]
        }
      },
      limitedPrivate: {
        attributes: {
          exclude: ["organizerId", "about", "type", "createdAt", "updatedAt"]
        }
      },
    },
  });
  return Group;
};