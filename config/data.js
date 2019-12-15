module.exports = {
    influx: {
        host: process.env.INFLUX_HOST || localhost,
        port: process.env.INFLUX_PORT || 8086,
        protocol: 'http',
        database: process.env.INFLUX_DATABASE || 'mandora',
        username: process.env.INFLUX_USERNAME || 'root',
        password: process.env.INFLUX_PASSWORD || 'root',
        retention: '2h'
    },
    store: {
        maxListeners: 64
    }
}