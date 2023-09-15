import QuestionDatabase from "../DataModel/QuestionDatabase";

function updateQuestionDatabase(updatedDatabase) {
    localStorage.setItem("questions", updatedDatabase)
}

function retrieveQuestionDatabase() {
    return localStorage.getItem("questions");
}

function setupQuestionDatabase() {
    localStorage.setItem("questions", QuestionDatabase());
}

export { setupQuestionDatabase, retrieveQuestionDatabase, updateQuestionDatabase };
