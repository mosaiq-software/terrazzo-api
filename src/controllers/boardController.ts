import {Board, Label} from "../../../terrazzo-common/src/types";
import {createBoard, getBoardById, getBoardMembers, updateBoard} from "@trz-api/persistence/boardPersistence";
import {getLabelsByBoardId, updateLabel} from "@trz-api/persistence/labelPersistence";
import {getAllListsOfBoard} from "@trz-api/controllers/listController";

//Gets

/**
 * Gets a board by its ID
 * Returns a promise of the type Board with all its lists, members, sprints, and labels
 * @param boardID
 */
export async function getWholeBoard(boardID:string) {
    //pull board from db with ID
    const board = await getBoardById(boardID);

    if(board == null) {
        throw new Error("Board not found");
    }

    try {
        board.lists = await getAllListsOfBoard(boardID);
        board.members = await getBoardMembers(boardID);
        board.sprints = [];
        board.labels = await getLabelsByBoardId(boardID);

        return board;
    } catch (e) {
        throw new Error("Failed to retrieve board" + e);
    }
}

//Creates

/**
 * Adds a new board to the database
 * You must pass in the board name and code
 * Returns the ID of the new board
 * @param name
 * @param boardCode
 */
export async function addBoard(name:string, boardCode:string) {

    const newBoard: Board = {
        id:"",
        boardCode:"",
        name:"",
        lists:[],
        members:[],
        sprints:[],
        labels:[],
        archived:false,
        createdAt:0,
        totalCards:0
    };

    if(name.length > 50) {
        throw new Error("Title must be 50 characters or less");
    }

    if(boardCode.length > 3) {
        throw new Error("Abbreviation must be 3 characters or less");
    }

    newBoard.id = crypto.randomUUID();
    newBoard.boardCode = boardCode;
    newBoard.name = name;
    newBoard.totalCards = 0;
    newBoard.createdAt = Date.now();

    try{
        await createBoard(newBoard);
        return newBoard.id;
    }catch (e) {
        throw new Error("Failed to save board" + e);
    }
}

//Updates
export async function updateBoardDetails(boardID: string, boardName: string, boardCode: string, labels: Label[], visibility: string){
    const boardDetails = await getBoardById(boardID);
    if (boardDetails == null) {
        throw new Error("Board not found");
    }
    if(boardName.length > 50) {
        throw new Error("Board Name must be 50 characters or less");
    }
    boardDetails.name = boardName;
    boardDetails.boardCode = boardCode;

    try {
        await updateBoard(boardDetails);
        const allLabels: Label[] = await getLabelsByBoardId(boardID); 
        const allLabelIds = allLabels.map(label => label.id); 
        const labelUpdatePromises = labels.map(async (label) => {
            if (!allLabelIds.includes(label.id)) {
                throw new Error(`Label ID ${label.id} does not exist on this board`);
            }
            const updatedLabel = {
                id: label.id,
                name: label.name,
                color: label.color
            }
            return updateLabel(updatedLabel);
        });
        await Promise.all(labelUpdatePromises);

        return true;
    }catch (e) {
        throw new Error("Failed to save board" + e);
    }
 }