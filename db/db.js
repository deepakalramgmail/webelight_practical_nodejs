module.exports = {
    client: 'mysql',
    connection: {
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DB
    },
    debug: true,
    pool: {
        min: 1,
        max: 200,
    }
}