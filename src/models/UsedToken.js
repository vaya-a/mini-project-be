module.exports = (sequelize, DataTypes) => {

    const UsedToken = sequelize.define("UsedToken", {

        token_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {},
    );

    return UsedToken;
}