module.exports = (sequelize, DataTypes) => {

    const Country = sequelize.define("Country", {

        country_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        country: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {},
    )
    Country.associate = models => {
        Country.hasMany(models.Blog, {foreignKey: "country_id"})
    }
    
    return Country;
}