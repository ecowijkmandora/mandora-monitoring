module.exports = {
    csv : {
        import : {
            originTag : "itho_monitoring",
            importPath : "import/itho",
            processedPath : "import/itho/processed",
            errorPath : "import/itho/error",
            delimiter : ";",
            dashboard_energy : {
                typeTag : "dashboard_energy",
                data_columns : {
                    0 : "timestamp",
                    1 : "generated",
                    3 : "consumed"
                }
            }
        }
    }
}