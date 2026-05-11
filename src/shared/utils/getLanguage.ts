// Returns language and language version
export const getLanguage = (language: string) => {
    switch (language) {
        case "cpp":
            return ["cpp14", "3"];
        case "java":
            return ["java", "1"];
        case "javascript":
            return ["nodejs", "0"];
        case "python":
            return ["python3", "3"];
        default:
            return;
    }
};