import User from "../models/users";

function calculateAgeDifference(dob1: string, dob2: string): number {
    const birthDate1 = new Date(dob1);
    const birthDate2 = new Date(dob2);
    const currentDate = new Date();

    const age1 = currentDate.getFullYear() - birthDate1.getFullYear();
    const age2 = currentDate.getFullYear() - birthDate2.getFullYear();

    return Math.abs(age1 - age2);
}

// Function to calculate similarity between two users
function calculateSimilarity(user1: User, user2: User): number {
    const averageHeight = 165; // Average height in cm
    const averageWeight = 62; // Average weight in kg

    let totalWeight = 0;
    let accumulatedScore = 0;

    const dobWeight = 0.3;
    if (user1.dob && user2.dob) {
        const ageGap = calculateAgeDifference(user1.dob, user2.dob);
        accumulatedScore += dobWeight * (1 / (1 + ageGap));
    } else {
        accumulatedScore += dobWeight * 0.5; // Default penalty for missing DOB
    }
    totalWeight += dobWeight;

    const heightWeight = 0.2;
    const user1Height = user1.height || averageHeight;
    const user2Height = user2.height || averageHeight;
    const heightDifference = Math.abs(user1Height - user2Height) / 30;
    accumulatedScore += heightWeight * (1 - heightDifference);
    totalWeight += heightWeight;

    const weightWeight = 0.2;
    const user1Weight = user1.weight || averageWeight;
    const user2Weight = user2.weight || averageWeight;
    const weightDifference = Math.abs(user1Weight - user2Weight) / 20.0;
    accumulatedScore += weightWeight * (1 - weightDifference);
    totalWeight += weightWeight;

    if (user1.budget && user2.budget) {
        const budgetWeight = 0.3;
        const budgetDifference = Math.abs(user1.budget - user2.budget) / 50.0;
        accumulatedScore += budgetWeight * (1 - budgetDifference);
        totalWeight += budgetWeight;
    }

    return totalWeight > 0 ? accumulatedScore / totalWeight : 0;
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
