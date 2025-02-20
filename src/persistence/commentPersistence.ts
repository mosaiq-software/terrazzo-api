import { Model, DataTypes } from 'sequelize';
import { sequelize } from './dbHelper';
import {Card, Comment} from '@mosaiq/terrazzo-common/types';

class CommentModel extends Model {}
CommentModel.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    parentID: DataTypes.STRING,
    content: DataTypes.STRING,
    postedById: DataTypes.STRING,
    postedAt: DataTypes.STRING,
    archived: DataTypes.BOOLEAN
}, { sequelize, modelName: 'commentModel' });

sequelize.sync();

export const getCommentById = async (id: string) => {
    return (await CommentModel.findByPk(id))?.toJSON() as Comment | null;
}

export const getCommentsByCardId = async (parentId: string) => {
    return (await CommentModel.findAll({ where: { parentId } })).map(comment => comment.toJSON()) as Comment[];
}

export const getCommentsByUserId = async (userId: string) => {
    return (await CommentModel.findAll({ where: { postedById: userId } })).map(comment => comment.toJSON()) as Comment[];
}

export const createCommentOnCard = async (comment: Comment, parentId: string) => {
    return await CommentModel.create({
        id: comment.id,
        parentId,
        content: comment.content,
        postedById: comment.postedById,
        postedAt: comment.postedAt,
        archived: false
    });
}

export const updateComment = async (comment: Comment) => {
    return await CommentModel.update({
        content: comment.content,
        archived: comment.archived
    }, { where: { id: comment.id } });
}

export const setCommentArchived = async (id: string, archived: boolean) => {
    return await CommentModel.update({ archived }, { where: { id } });
}

