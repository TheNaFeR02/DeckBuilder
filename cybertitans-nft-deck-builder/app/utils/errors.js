export class MaxBuildsExceededError extends Error {
    constructor(message) {
        super(message);
        this.name = "MaxBuildsExceededError";
    }
}