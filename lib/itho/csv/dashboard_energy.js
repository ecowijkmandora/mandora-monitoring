require('module-alias/register')
const config = require('@config')
const fs = require('fs')
const parse = require('csv-parse')
const _ = require('lodash')
const moment = require('moment');
const { store } = require('@lib/data')

const CSV_ORIGIN_TAG = config.itho.csv.import.sourceTag
const CSV_TYPE_TAG = config.itho.csv.import.dashboard_energy.typeTag
const CSV_DELIMITER = config.itho.csv.import.delimiter
const CSV_COLUMNS = config.itho.csv.import.dashboard_energy.data_columns

const source = "3991MA2"

// Date Time;Total generated energy by the installation after completion;Date Time;Total consumed energy by the installation after completion
const parser = parse({
    delimiter: CSV_DELIMITER,
    from_line: 2
})

let errors = []
let processed = []


// Use the readable stream api
parser.on('readable', () => {
    let record
    while (record = parser.read()) {        
        //console.log('CSV parse record', record)
        if (verifyRecord(record)) {
            //console.log('CSV parse record - valid record')

            let data = {}

            // Collect data from record
            _.forEach(CSV_COLUMNS, (column, idx, arr) => {            
                let value = record[idx]
                //console.log(`Column ${idx} (${column}):`,value) 
                
                switch (column) {
                    case 'timestamp':
                        // "7/30/2019, 2:00:00 AM"
                        value = moment(value,'M/D/YYYY, h:mm:ss a')
                        //console.log("Timestamp:",value.format())
                        break
                    case 'generated':
                    case 'consumed':
                        value = parseFloat(value.split(",").join("."))
                        //console.log("Float:",value)
                        break
                    default:
                        break
                }

                data[column] = value
            })

            // Store data in data store
            store.addIthoData(CSV_ORIGIN_TAG,source,CSV_TYPE_TAG,data)

            console.log("CSV parse record - row data:",data)

            // Push record to array of processed lines
            processed.push(record)
        } else {
            console.log('CSV parse record - invalid record')

            // Push record to array of invalid lines
            errors.push(record)
        }
    }
})

const verifyRecord = (record) => {
    if (!_.isEqual(record[0],record[2])) {
        console.log('CSV parse record - Verify record - Timestamps do not match')
        return false
    }

    return true
} 

// Catch any error
parser.on('error', (err) => {
    console.error('CSV parse error:', err.message)
})

// When we are done, test that the parsed output matched what expected
parser.on('end', () => {
    console.log("CSV parse end")
})

fs.createReadStream(__dirname + '/dashboard_energy.csv').pipe(parser)