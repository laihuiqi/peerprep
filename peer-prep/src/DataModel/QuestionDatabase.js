// A Class that stores and encapsulates Database Features

class QuestionDatabase {
    constructor() {
        this.database = new Map();
    }

    setDatabase(database) {
        this.database = database;
    }

    clearDatabase() {
        this.database = new Map();
    }

    addQuestion(questionToAdd) {
        if (!this.isDuplicateQuestion(questionToAdd)) {
            this.database.set(questionToAdd.id, questionToAdd);
        }
    }

    deleteQuestion(questionId) {
        if (this.database.has(questionId)) {
            this.database.delete(questionId);
        }
    }

    updateQuestion(questionToUpdate) {
        this.database.set(questionToUpdate.id, questionToUpdate);
    }

    getAllQuestions() {
        var questionList = [];

        for (const [key, value] of this.database) {
            questionList.push(value);
        }

        return questionList;
    }

    isDuplicateQuestion(questionToCheck) {
        if (this.database.has(questionToCheck.id)) {
            return true;
        }

        var questionList = this.getAllQuestions();

        for (var i = 0; i < questionList.length; i++) {
            if (questionToCheck.title === questionList[i].title) {
                return true;
            }

            if (questionToCheck.description === questionList[i].description) {
                return true;
            }
        }

        return false;
    }

    toJSON() {
        return this.database;
    }
}

export default QuestionDatabase;
