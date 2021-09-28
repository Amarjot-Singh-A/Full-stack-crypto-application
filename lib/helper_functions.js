
const executeQuery = (connection, sqlQuery) => {
    return new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, result) => {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

const bcryptComparePassword = (bcrypt, password, retrievedHash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, retrievedHash, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
}



const bcryptHashPassword = (bcrypt, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 12, async function (err, hash) {
            if (err) {
                reject(err)
            }
            resolve(hash)
        })
    })
}


const signUpUser = async ({ firstName, lastName, email, password }, connection, bcrypt) => {
    try {
        let hashedPassword = await bcryptHashPassword(bcrypt, password)
        let query = `INSERT INTO users(email,password,first_name,last_name) 
        VALUES('${email}','${hashedPassword}','${firstName}','${lastName}')`
        let resultOfUserQuery = await executeQuery(connection, query)
        return { result: resultOfUserQuery, err: null }
    }
    catch (err) {
        console.error('error in signUpUser', err)
        return { result: null, err }
    }
}


const verifySignIn = async (connection, bcrypt, email, password) => {

    try {
        const query = `SELECT first_name,password FROM users WHERE email='${email}'`
        let queryResult = await executeQuery(connection, query)
        let isPasswordMatch = await bcryptComparePassword(bcrypt, password, queryResult[0].password)
        return { isPasswordMatch: isPasswordMatch, firstName: queryResult[0].first_name }
    }

    catch (err) {
        console.error('error in verifysignin', err)
    }

}

const mysqlErrorCodes = ({errno}) => {
    switch (errno) {
        case 1062:
            return 'user with email already exist'
    
        default:
            return 'Error while creating user'
    }
}

module.exports = { verifySignIn, signUpUser, mysqlErrorCodes}

