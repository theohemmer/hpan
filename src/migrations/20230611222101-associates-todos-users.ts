import { DataTypes, QueryInterface, Sequelize } from "sequelize";

module.exports = {
    async up(queryInterface) {
        await queryInterface.addColumn('Todos', 'userId', {
            type: DataTypes.UUID,
            references: {
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            
        })
    },
    async down(queryInterface) {
        await queryInterface.removeColumn('Todos', 'userId');
    }
}