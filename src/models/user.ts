import { Table, Column, Model, DataType, Unique, NotNull, AllowNull, Not, Default, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import Todo from './todo';

@Table({
    modelName: "User",
    tableName: "Users"
})
class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    })
    id: number;

    @Column(DataType.STRING)
    username: string

    @Column(DataType.STRING)
    password: string;
    
    @HasMany(() => Todo)
    todos: Todo[];

    @Column(DataType.STRING)
    lastAuthToken: string;
}

export default User;