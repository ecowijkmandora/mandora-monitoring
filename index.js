/**
 * Mandora Monitoring
 */
require('module-alias/register')

// Initialize logger
require('@lib/logger')

// Initialize data store 
require('@lib/data')

// Initialize Itho services
const itho = require('@lib/itho')

itho.csv.import.importCsvEnergyInstallation('3991MA2',__dirname + '/data/itho/20190830/dashboard_energy_3991MA2.csv')
//itho.csv.import.temperature(__dirname + '/data/itho/20190830/dashboard_temps_3991MA2.csv')
itho.csv.import.importCsvTemperatureEnv('3991MA2',__dirname + '/data/itho/20190830/wpu_temps_3991MA2.csv')