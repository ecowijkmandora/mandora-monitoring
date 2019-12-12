module.exports = {
    influx: {
        host: 'localhost',
        port: 8086,
        database: 'mandora',
        retention: '2h'
    },
    store: {
        maxListeners: 64
    }
}