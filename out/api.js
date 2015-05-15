YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "DB_Transactions",
        "downloadSchedule",
        "generateSchedule",
        "index.js",
        "upload"
    ],
    "modules": [
        "DB_Transactions.js",
        "body-parser",
        "cookie-parser",
        "express",
        "fs",
        "index.js",
        "json2xls",
        "morgan",
        "multer",
        "path",
        "underscore",
        "xlsx"
    ],
    "allModules": [
        {
            "displayName": "body-parser",
            "name": "body-parser",
            "description": "Body-Parser is used by Express as part of the generation of the starter app"
        },
        {
            "displayName": "cookie-parser",
            "name": "cookie-parser",
            "description": "Cookie-Parser is used by Express as part of the generation of the starter app"
        },
        {
            "displayName": "DB_Transactions.js",
            "name": "DB_Transactions.js",
            "description": "This is the database transactions script,\nit holds all the communication functions for the\napp."
        },
        {
            "displayName": "express",
            "name": "express",
            "description": "Express is used for the routing, and generating of the starter application"
        },
        {
            "displayName": "fs",
            "name": "fs",
            "description": "Is used to write the application"
        },
        {
            "displayName": "index.js",
            "name": "index.js",
            "description": "Index JS is the main route handling module"
        },
        {
            "displayName": "json2xls",
            "name": "json2xls",
            "description": "Is used to turn the array of class information into\n the final schedule.xlsx file"
        },
        {
            "displayName": "morgan",
            "name": "morgan",
            "description": "Morgan is used to create temporary files for upload/download"
        },
        {
            "displayName": "multer",
            "name": "multer",
            "description": "Is needed for file transfers"
        },
        {
            "displayName": "path",
            "name": "path",
            "description": "Path is used to get the location of other modules"
        },
        {
            "displayName": "underscore",
            "name": "underscore",
            "description": "Is a very handy module that has many functions built in\nto handle sorting, filtering of lists/objects"
        },
        {
            "displayName": "xlsx",
            "name": "xlsx",
            "description": "Xlsx is the Excel parsing module.  It has many outputs,\nfor this project the WS and _toJson are used."
        }
    ]
} };
});