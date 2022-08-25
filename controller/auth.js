const test = async (req, res) => {
    try {
        res.sendSuccess({}, "working fine")
    }
    catch (error) {
        res.sendError(error.message)
    }
}

module.exports = { test }
