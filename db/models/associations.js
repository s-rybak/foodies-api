import User from "./User.js";
import Recipe from "./Recipe.js";
import UserFavorite from "./UserFavorite.js";
import Testimonial from "./Testimonial.js";

UserFavorite.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

UserFavorite.belongsTo(Recipe, {
  foreignKey: "recipeId",
  as: "recipe",
});

Testimonial.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Testimonial, {
  foreignKey: "userId",
  as: "testimonials",
});
