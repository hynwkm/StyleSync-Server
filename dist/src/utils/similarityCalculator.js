"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function calculateAgeDifference(dob1, dob2) {
    const birthDate1 = new Date(dob1);
    const birthDate2 = new Date(dob2);
    const currentDate = new Date();
    const age1 = currentDate.getFullYear() - birthDate1.getFullYear();
    const age2 = currentDate.getFullYear() - birthDate2.getFullYear();
    return Math.abs(age1 - age2);
}
function calculateSimilarity(user1, user2) {
    const maxAgeDifference = 50;
    const maxHeightDifference = 50;
    const maxWeightDifference = 50;
    // Adjusted maximum budget difference for a single outfit
    const maxBudgetDifference = 200;
    let dobScore = 0, heightScore = 0, weightScore = 0, budgetScore = 0;
    let activeWeights = 0;
    // Date of Birth Score
    if (user1.dob && user2.dob) {
        const ageDifference = calculateAgeDifference(user1.dob, user2.dob);
        dobScore = Math.max(1 - ageDifference / maxAgeDifference, 0) * 0.27;
        activeWeights += 0.27;
    }
    // Height Score
    if (user1.height != null && user2.height != null) {
        const heightDifference = Math.abs(user1.height - user2.height);
        heightScore =
            Math.max(1 - heightDifference / maxHeightDifference, 0) * 0.23;
        activeWeights += 0.23;
    }
    // Weight Score
    if (user1.weight != null && user2.weight != null) {
        const weightDifference = Math.abs(user1.weight - user2.weight);
        weightScore =
            Math.max(1 - weightDifference / maxWeightDifference, 0) * 0.25;
        activeWeights += 0.25;
    }
    // Budget Score
    if (user1.budget != null && user2.budget != null) {
        const budgetDifference = Math.abs(user1.budget - user2.budget);
        budgetScore =
            Math.max(1 - Math.pow((budgetDifference / maxBudgetDifference), 2), 0) *
                0.25;
        activeWeights += 0.25;
    }
    // Calculating the total score
    let totalScore = dobScore + heightScore + weightScore + budgetScore;
    // Normalizing the total score to a 0-100 scale
    return activeWeights > 0 ? (totalScore / activeWeights) * 100 : 0;
}
function findSimilarUsers(current_user, all_users) {
    const similarityScores = all_users.map((user) => [
        user,
        calculateSimilarity(current_user, user),
    ]);
    return similarityScores.sort((a, b) => b[1] - a[1]);
}
exports.default = findSimilarUsers;
