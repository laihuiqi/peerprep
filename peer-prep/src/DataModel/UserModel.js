// Class that stores and encapsulates User Info

class UserModel {
    constructor(id, name, email) {
      this.id = id;
      this.name = name;
      this.email = email;

      this.adminStatus = false;
      this.preferredLanguage = null;
      this.githubId = null
    }

    updateName(newName) {
        this.name = newName;
    }

    updateEmail(newEmail) {
        this.email = newEmail;
    }

    updateAdminStatus(newAdminStatus) {
        this.adminStatus = newAdminStatus;
    }

    updatePreferredLanguage(newPreferredLanguage) {
        this.preferredLanguage = newPreferredLanguage;
    }

    updateGithubId(newGithubId) {
        this.githubId = newGithubId;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            adminStatus: this.adminStatus,
            preferredLanguage: this.preferredLanguage,
            githubId: this.githubId
        };
    }
}
  
export default UserModel;
