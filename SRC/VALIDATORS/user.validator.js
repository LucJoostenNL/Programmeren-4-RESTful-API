module.exports = {

    validateUser: (user, callback) => {

        //check firstname
        const nameValidator = new RegExp("^[a-zA-Z][a-z A-Z]*$")
        if (typeof user.FirstName !== "string" || !nameValidator.test(user.FirstName)){
            const errorObject = {
                message: 'First name missing or invalid',
                code: 400
            }
            callback(errorObject)
            return;
        }
        
        //check lastname 
        if (typeof user.LastName !== "string" || !nameValidator.test(user.LastName)){
            const errorObject = {
                message: 'Last name missing or invalid',
                code: 400
            }
            callback(errorObject)
            return;
        }

        //
        
    }
    

}