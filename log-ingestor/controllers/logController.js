// logController.js
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')

const Log = require('../models/Log');
const { use } = require('../routes/logRoutes');
const BASE_DIR = path.join(__dirname,'..','logs/')

function isValidDateValue(value) {
    const date = new Date(value);

    return !isNaN(date.getTime())
}

exports.createLog = async (req, res) => {
    // const name = req.body.metadata.source;
    // console.log(req.body)

    // Create log file name

    const userInput = await inquirer.prompt([
        {
            type : 'input',
            name : 'level',
            message : 'Enter Level'
        },
        {
            type : 'input',
            name : 'log_string',
            message : 'Enter Log String'
        },
        {
            type : 'input',
            name : 'source',
            message : 'Enter Source'
        }
    ])
   const timeRetrieved = new Date().toISOString()
   console.log(timeRetrieved)
    const requestBody = {
        level : userInput.level,
        log_string : userInput.log_string,
        timestamp : timeRetrieved,
        metadata : {
            source : userInput.source
        }
    }
    const logFilePath = path.join(BASE_DIR, userInput.source);

    // Check if log file exists
    fs.access(logFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            // If log file doesn't exist, create a new one
            fs.writeFile(logFilePath, JSON.stringify([]), (err) => {
                if (err) throw err;
                console.log('Log file created:', logFilePath);
            });
        }

        // Read existing log data
        fs.readFile(logFilePath, 'utf8', (err, data) => {
            if (err) throw err;

            let logs = JSON.parse(data);

            // Append request and response data to log data
            logs.push({ requestData: requestBody, responseData: requestBody });

            // Write updated log data back to file
            fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (err) => {
                if (err) throw err;
                console.log('Data appended to log file:', logFilePath);
            });
        });
    });

    res.json({ message: 'Data logged successfully.' });
  
};


exports.searchLogs = async (req, res) => {
//   const { level, log_string, timestamp, source } = req.body;
  const logDirect = path.join( __dirname,'..','logs')
  const logFiles = fs.readdirSync(logDirect); // Assuming logs are stored in a 'logs' directory

  let filteredLogs = [];

  const userInput = await inquirer.prompt([
    {
        type : 'input',
        name : 'level',
        message : 'Enter Level'
    },
    {
        type : 'input',
        name : 'log_string',
        message : 'Enter Log String'
    },
    {
        type : 'input',
        name : 'source',
        message : 'Enter Source'
    },
    {
        type : 'input',
        name : 'timestamp',
        message : 'Enter timestamp'
    }
])


    console.log(isValidDateValue(userInput.timestamp))
  logFiles.forEach((file) => {
    const filePath = path.join(logDirect, file);
    const logsContent = fs.readFileSync(filePath, 'utf8');

    try {
      const logsArray = JSON.parse(logsContent);
      
      logsArray.forEach((log) => {
        if (
          (userInput.level === '' || log.requestData.level === userInput.level) &&
          (userInput.log_string === '' || log.requestData.log_string.includes(userInput.log_string)) &&
          (!isValidDateValue(userInput.timestamp) ||  new Date(log.requestData.timestamp).toISOString().split('T')[0] === userInput.timestamp) &&
          (userInput.source === '' || log.requestData.metadata.source === userInput.source)
        ) {
          filteredLogs.push(log);
        }
      });

      
    } catch (error) {
      console.error('Error parsing log file:', error);
    }
  });

  console.log(filteredLogs)

  res.json({count : filteredLogs.length,data : filteredLogs});
  

};





