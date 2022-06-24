import * as fs from 'fs'
const path = require('path');
import chalk from 'chalk'

const jsonExp = /\.json$/;

const ethAddressExp = /^(0x)?[0-9a-f]{40}$/i;

const isEthAddress = address => ethAddressExp.test(address);


const validator = path.resolve(__dirname, '../src/validator');

const jsonFileNames = fs.readdirSync(validator);

const jsonFileNameFilter = jsonFileName => {
  return jsonFileName !== '$template.json' && jsonFileName.endsWith('.json')
}

const exitWithMsg = (msg) => {
  console.log(chalk.red(msg))
  process.exit(1)
}

const jsonFileCheck = (jsonFileName) => {
  const addr = jsonFileName.replace(jsonExp, '')
  if (!isEthAddress(addr)) {
    exitWithMsg(`ERROR! json file name ${jsonFileName} is not like a ETHEREUM address.json`)
  }
  const content = fs.readFileSync(`${validator}/${jsonFileName}`,'utf-8').toString();

  if (content.indexOf('�') !== -1) {
    exitWithMsg(`ERROR! json file name ${jsonFileName} must be utf-8 encoding`)
  }

  let json_content = null;

  try {
    json_content = JSON.parse(content);
  } catch(e) {
    if (e) {
      exitWithMsg(`ERROR! json file name ${jsonFileName} parse error, please check first (maybe has some unnecessary space or comma symbol like ",")`)
    }
  }

  const address = json_content.nodeAddress

  const filenameWithoutExt = jsonFileName.replace(jsonExp, '')

  if (!address) {
    exitWithMsg(`ERROR! json file ${jsonFileName} content must have nodeAddress field`)
  }
  if (!isEthAddress(address)) {
    exitWithMsg(`ERROR! json file ${jsonFileName} address field must be an ethereum address`)
  }
  if (address.toLowerCase() !== filenameWithoutExt.toLowerCase()) {
    exitWithMsg(`ERROR! json file ${jsonFileName} should be the same with address field ${address}`)
  }
}

jsonFileNames
  .filter(jsonFileNameFilter)
  .forEach(jsonFileName => {
    jsonFileCheck(jsonFileName)
  })

console.log('All files test successfully!');
