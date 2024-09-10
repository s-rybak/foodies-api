import Recipe from './Recipe.js';
import UserFavorite from './UserFavorite.js';
import User from './User.js';

UserFavorite.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner'
});

UserFavorite.belongsTo(Recipe, {
    foreignKey: 'recipeId',
    as: 'recipe'
});