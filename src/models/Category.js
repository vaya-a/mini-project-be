module.exports = (sequelize, DataTypes) => {

    const Category = sequelize.define("Category", {

        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        category: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {},
    );

    Category.associate = models => {
        Category.hasMany(models.Blog, {foreignKey: "category_id"})
    }

    return Category;
}