import { DataTypes, QueryInterface, Sequelize } from "sequelize";

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            username: {
                type: DataTypes.STRING
            },
            password: {
                type: DataTypes.STRING,
            },
            lastAuthToken: {
                type: DataTypes.STRING
            }
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Users');
    }
}