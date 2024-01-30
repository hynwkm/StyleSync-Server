export default interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    dob: string; // Date of Birth
    gender: string;
    height: number;
    weight: number;
    rating: number;
    budget: number;
    bio: string;
    profile_pic: string;
    profile_visibility: boolean;
}
