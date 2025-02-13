//Gets

import {createCommentOnCard, getCommentsByCardId} from "@trz-api/persistence/commentPersistence";
import {User, Comment} from "@mosaiq/terrazzo-common/types";
import {getCardById} from "@trz-api/persistence/cardPersistence";

/**
 * Gets all comments of a list by card ID
 * All cards are returned with all their labels, checklists, comments, and timesheet entries
 * Returns a promise of all cards in the list
 * @param cardID
 */
export async function getAllCommentsOfCard(cardID: string) {
    try {
        const comments = await getCommentsByCardId(cardID);
        if (!comments) return [];
        return comments;
    } catch (e: any) {
        throw new Error("Failed to retrieve board" + e);
    }
}

//Creates

/**
 * Adds an empty card to an existing list via the list ID
 * You must pass in the list ID and the card name
 * Returns the ID of the new card
 * @param listID
 * @param cardName
 */
export async function addComment(cardId: string, content: string, postedAt: Date, postedBy: User, archived: boolean) {
    //pull board from db with ID
    const updatingCard = await getCardById(cardId);

    if (updatingCard == null) {
        throw new Error("Card not found");
    }

    const newComment: Comment  = {
        id: crypto.randomUUID(),
        cardId: cardId,
        content: content,
        postedAt: postedAt,
        postedBy: postedBy,
        archived: archived
    };

    //creates comment before returning
    //add try statement for error handling
    try {
        await createCommentOnCard(newComment, cardId)
        return newComment.id;
    } catch (e: any) {
        throw new Error("Failed to save Card" + e);
    }
}

//Updates

// /**
//  * Updates the description of a card
//  * You must pass in the card ID and the new description
//  * Returns true if successful
//  * @param cardID
//  * @param description
//  */
// export async function editDescription(cardID: string, description: string) {
//
//     //Add any checks here for any future use
//     try {
//         await updateDescription(cardID, description);
//         return true;
//     } catch (e) {
//         throw new Error("Failed to save Card" + e);
//     }
// }