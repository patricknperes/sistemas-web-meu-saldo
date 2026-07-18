import { userService } from "../../../services/userService.js";

export const profileKeys = {
    all: ["profile"],
    own: () => [...profileKeys.all, "own"],
};

export async function fetchOwnProfile() {
    const response = await userService.getOwnProfile();
    return response?.user ?? response;
}
