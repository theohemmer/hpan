import { Table, Column, Model, DataType, Unique, NotNull, AllowNull, Not, Default, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';

@Table({
    modelName: "Todo",
    tableName: "Todos"
})
class Todo extends Model<Todo> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    })
    id: number;

    @Column(DataType.STRING)
    name: string

    @Column(DataType.INTEGER)
    importance: number;
    
    @Column(DataType.INTEGER)
    urgence: number;
    
    @Column(DataType.BOOLEAN)
    done: boolean

    @Column(DataType.DATE)
    doneAt: Date;
}

export default Todo