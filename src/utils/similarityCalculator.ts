import User from "../models/users";

function calculateAgeDifference(dob1: string, dob2: string): number {
    const birthDate1 = new Date(dob1);
    const birthDate2 = new Date(dob2);
    const currentDate = new Date();

    const age1 = currentDate.getFullYear() - birthDate1.getFullYear();
    const age2 = currentDate.getFullYear() - birthDate2.getFullYear();

    return Math.abs(age1 - age2);
}

function calculateSimilarity(user1: User, user2: User): number {
    const maxAgeDifference = 50;
    const maxHeightDifference = 50;
    const maxWeightDifference = 50;

    const maxBudgetDifference = 200;

    let dobScore = 0,
        heightScore = 0,
        weightScore = 0,
        budgetScore = 0;
    let activeWeights = 0;

    if (user1.dob && user2.dob) {
        const ageDifference = calculateAgeDifference(user1.dob, user2.dob);
        dobScore = Math.max(1 - ageDifference / maxAgeDifference, 0) * 0.27;
        activeWeights += 0.27;
    }

    if (user1.height != null && user2.height != null) {
        const heightDifference = Math.abs(user1.height - user2.height);
        heightScore =
            Math.max(1 - heightDifference / maxHeightDifference, 0) * 0.23;
        activeWeights += 0.23;
    }

    if (user1.weight != null && user2.weight != null) {
        const weightDifference = Math.abs(user1.weight - user2.weight);
        weightScore =
            Math.max(1 - weightDifference / maxWeightDifference, 0) * 0.25;
        activeWeights += 0.25;
    }

    if (user1.budget != null && user2.budget != null) {
        const budgetDifference = Math.abs(user1.budget - user2.budget);
        budgetScore =
            Math.max(1 - (budgetDifference / maxBudgetDifference) ** 2, 0) *
            0.25;
        activeWeights += 0.25;
    }

    let totalScore = dobScore + heightScore + weightScore + budgetScore;

    return activeWeights > 0 ? (totalScore / activeWeights) * 100 : 0;
}

export default function findSimilarUsers(
    current_user: User,
    all_users: User[]
): [User, number][] {
    const similarityScores: [User, number][] = all_users.map((user) => [
        user,
        calculateSimilarity(current_user, user),
    ]);

    return similarityScores.sort((a, b) => b[1] - a[1]);
}
