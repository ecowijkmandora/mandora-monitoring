module.exports = {
    influx: {
        host: 'localhost',
        port: 8086,
        database: 'mandora-monitoring',
        retention: '2h'
    },
    store: {
        maxListeners: 64
    }
}