import { DataTypes, QueryInterface, Sequelize } from "sequelize";

module.exports = {
    async up(queryInterface) {
        await queryInterface.addColumn('Todos', 'userId', {
            type: DataTypes.UUID,
            references: {
                model: 'ClientUsers',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            
        }).then(async () => {
            await queryInterface.addConstraint('Todos', {
                type: 'FOREIGN KEY',
                fields: [
                    'userId'
                ]
            })
        })
    },
    async down(queryInterface) {
        await queryInterface.removeColumn('Todos', 'userId');
    }
}