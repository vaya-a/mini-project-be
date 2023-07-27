module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isVerified:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        profilePicture: {
            type: DataTypes.STRING
        }

    }, {},
    )
    User.associate = models => {
        User.hasMany(models.Blog, {foreignKey: "user_id"})
    }

    return User;
}