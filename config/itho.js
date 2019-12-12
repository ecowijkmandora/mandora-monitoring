module.exports = {
    csv : {
        import : {
            originTag : "itho_monitoring",
            importPath : "import/itho",
            processedPath : "import/itho/processed",
            errorPath : "import/itho/error",
            delimiter : ";",
            energy : {
                typeTag : "energy",
                data_columns : {
                    0 : "datetime",
                    1 : "generated",
                    3 : "consumed"
                }
            }
        }
    }
}