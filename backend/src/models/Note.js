const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Note = sequelize.define('Note', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  tags: { type: DataTypes.STRING(500), defaultValue: '' },
  user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
});

Note.belongsTo(User, { foreignKey: 'user_id', as: 'author' });
User.hasMany(Note, { foreignKey: 'user_id', as: 'notes' });

module.exports = Note;
