import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ActivityID = bigint;
export type Time = bigint;
export interface ActivityInput {
    title: string;
    date: Time;
    time: string;
    description: string;
    category: Category;
    location: string;
}
export interface Activity {
    id: ActivityID;
    organizer: Principal;
    title: string;
    date: Time;
    time: string;
    description: string;
    participantCount: bigint;
    category: Category;
    location: string;
}
export enum Category {
    social = "social",
    arts = "arts",
    academic = "academic",
    sports = "sports"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createActivity(input: ActivityInput): Promise<ActivityID>;
    getActivityDetails(activityId: ActivityID): Promise<Activity | null>;
    getCallerUserRole(): Promise<UserRole>;
    getParticipants(activityId: ActivityID): Promise<Array<Principal>>;
    getUpcomingActivities(): Promise<Array<Activity>>;
    getUserRegistrations(user: Principal): Promise<Array<ActivityID>>;
    isCallerAdmin(): Promise<boolean>;
    registerForActivity(activityId: ActivityID): Promise<void>;
}
