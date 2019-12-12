module.exports = {
    csv: {
        import: {
            measurementPrefix: "itho_",
            sourceTag: "csv",
            importPath: "import/itho",
            processedPath: "import/itho/processed",
            errorPath: "import/itho/error",
            delimiter: ";",
            energy: {
                measurement: "energy",
                data_columns: {
                    0: "datetime",
                    1: "generated",
                    3: "consumed"
                }
            },
            temperature: {
                measurement: "temperature",
                data_columns: {
                    0: "datetime",
                    1: "outdoor",
                    3: "indoor",
                    5: "setpoint"
                }
            }            
        },
        export: {
            measurement: "itho",
            sourceTag: "csv",
            importPath: "export/itho",
            delimiter: ";"
        }
    }
}