import { DataTypes, QueryInterface, Sequelize } from "sequelize";

module.exports = {
    async up(queryInterface) {
        queryInterface.createTable('ProUsers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            name: {
                type: DataTypes.STRING
            },
            importance: {
                type: DataTypes.INTEGER,
            },
            urgence: {
                type: DataTypes.INTEGER,
            },
            done: {
                type: DataTypes.BOOLEAN,
            },
            isConfirmed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('ProUsers');
    }
}