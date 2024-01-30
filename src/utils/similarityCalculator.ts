function calculateAgeDifference(dob1: string, dob2: string): number {
    const birthDate1 = new Date(dob1);
    const birthDate2 = new Date(dob2);
    const currentDateObj = new Date();

    const age1 = currentDateObj.getUTCFullYear() - birthDate1.getUTCFullYear();
    const age2 = currentDateObj.getUTCFullYear() - birthDate2.getUTCFullYear();

    return Math.abs(age1 - age2);
}

// function calculateSimilarity(user1: User, user2: User): number {
//     const dobWeight = 0.3;
//     const heightWeight = 0.2;
//     const weightWeight = 0.2;
//     const budgetWeight = 0.3;

//     const ageGap = Math.abs(user1.calculateAge() - user2.calculateAge());

//     const heightNormalized = Math.abs(user1.height_cm - user2.height_cm) / 30.0;
//     const weightNormalized = Math.abs(user1.weight_kg - user2.weight_kg) / 20.0;
//     const budgetNormalized = Math.abs(user1.budget - user2.budget) / 50.0;

//     const similarityScore =
//         dobWeight * (1 / (1 + ageGap)) +
//         heightWeight * (1 - heightNormalized) +
//         weightWeight * (1 - weightNormalized) +
//         budgetWeight * (1 - budgetNormalized);

//     return similarityScore;
// }

// function findSimilarUsers(
//     current_user: User,
//     all_users: User[]
// ): [User, number][] {
//     const similarityScores: [User, number][] = all_users.map((user) => [
//         user,
//         calculateSimilarity(current_user, user),
//     ]);

//     const sortedUsers = similarityScores.sort((a, b) => b[1] - a[1]);

//     return sortedUsers;
// }
