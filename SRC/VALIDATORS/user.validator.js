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
                code: 406
            }
            callback(errorObject)
            return;
        }

        //check date of birth
        const birth = new RegExp('^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})')
        if (typeof user.dateOfBirth != 'string' || !birth.test(user.dateOfBirth)) {
            const errorObject = {
                message: 'Date of birth is missing or invalid, format to write is: YYYY-MM-DD',
                code: 400
            }
        }       
    }
}