import {DataTypes, Model} from "sequelize";
import {sequelize} from "@trz-api/persistence/dbHelper";

class BurndownModel extends Model {}
BurndownModel.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    boardId: DataTypes.STRING,
    name: DataTypes.STRING,
    sprintId: DataTypes.STRING,
    totalDays: DataTypes.INTEGER,
    totalTasks: DataTypes.INTEGER,
    tasksCompleted: DataTypes.INTEGER,
    tasksUncompleted: DataTypes.INTEGER,
    taskCompletedPerDay: DataTypes.JSON,
}, { sequelize, modelName: 'burndownModel' });

sequelize.sync();

export const getBurndownById = async (id: string) => {
    return (await BurndownModel.findByPk(id))?.toJSON() as any;
};

export const getBurndownsByBoardId = async (boardId: string) => {
    return (await BurndownModel.findOne({ where: { boardId } }))?.toJSON() as any; //copilot thing, will change later
};

export const getBurndownBySprintId = async (sprintId: string) => {
    return (await BurndownModel.findOne({ where: { sprintId } }))?.toJSON() as any;
};

export const createBurndown = async (burndown: any) => {
    return await BurndownModel.create({
        id: burndown.id,
        boardId: burndown.boardId,
        name: burndown.name,
        sprintId: burndown.sprintId,
        startDate: burndown.startDate,
        endDate: burndown.endDate,
        totalDays: burndown.totalDays,
        totalTasks: burndown.totalTasks,
        tasksCompleted: burndown.tasksCompleted,
        tasksUncompleted: burndown.tasksUncompleted,
        taskCompletedPerDay: burndown.taskCompletedPerDay
    });
};