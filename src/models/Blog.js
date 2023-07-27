module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define("Blog", {
        blog_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        keywords: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull:false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        country_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        video_url:{
            type: DataTypes.STRING
        },
        img_url:{
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {},
    );

    Blog.associate = models => {
        Blog.belongsTo(models.User, {foreignKey: "user_id"})
        Blog.belongsTo(models.Category, {foreignKey: "category_id"})
        Blog.belongsTo(models.Country, {foreignKey: "country_id"})
    }

    return Blog;
}