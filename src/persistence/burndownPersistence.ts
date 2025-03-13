import {DataTypes, Model} from "sequelize";
import {sequelize} from "@trz-api/persistence/dbHelper";
import {Card, ListId} from "../../../terrazzo-common/dist/types";

class BurndownModel extends Model {}
BurndownModel.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    listId: DataTypes.STRING,
    cardNumber: DataTypes.INTEGER,
    name: DataTypes.STRING,
    descriptionTextBlockId: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    storyPoints: DataTypes.INTEGER,
    sprintId: DataTypes.STRING,
    archived: DataTypes.BOOLEAN,
    order: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    copiedDate: DataTypes.DATE,
}, { sequelize, modelName: 'burndownModel' });

sequelize.sync();

export const copyCard = async (card: Card) => {
    return await BurndownModel.create({
        id: card.id,
        listId: card.listId,
        cardNumber: card.cardNumber,
        name: card.name,
        descriptionTextBlockId: card.descriptionTextBlockId,
        priority: card.priority,
        storyPoints: card.storyPoints,
        sprintId: card.sprintId,
        archived: true,
        order: card.order,
        startDate: card.startDate,
        endDate: card.endDate,
        copiedDate: new Date()
    });
};

export const getCardBySprintId = async (sprintId:ListId) => {
    return (await BurndownModel.findAll({
        where: { sprintId }
    })).map(card => card.toJSON()) as Card[];
}