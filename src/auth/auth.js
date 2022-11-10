const jwt = require('jsonwebtoken')

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization

        if (!token || token == "Bearer null") return res.status(401).send({ status: false, message: 'Token must be present in bearer token' })


        let Token = token.split(' ')

        jwt.verify(Token[1], "dataSchool", function (err, data) {
            if (err) {
                return res.status(400).send({ status: false, message: err.message })
            }
            else {
                req.schoolDetail = data.schoolId;
                next()
            }

        });

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }

}

module.exports = { authenticate }