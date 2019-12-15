module.exports = {
    influx: {
        host: process.env.INFLUX_HOST,
        port: process.env.INFLUX_PORT,
        protocol: 'http',
        database: process.env.INFLUX_DATABASE,
        username: process.env.INFLUX_USERNAME,
        password: process.env.INFLUX_PASSWORD,
        retention: '2h'
    },
    store: {
        maxListeners: 64
    }
}