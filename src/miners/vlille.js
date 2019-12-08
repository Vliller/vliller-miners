require('dotenv').config();

const request = require("request");
const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
  host: process.env.ES_HOST,
  log: process.env.ES_LOG_LEVEL
});

const VLILLE_URL = `${process.env.VLILLE_API_BASE}&rows=-1&apikey=${process.env.VLILLE_API_KEY}`;
const ELASTIC_INDEX = process.env.ES_INDEX;
// const ELASTIC_INDEX = 'demo';

/**
 * Basic Slack alerting
 *
 * @param {Error} error
 */
function sendAlertToSlack(error) {
  request.post({
    url: process.env.SLACK_WEBHOOK,
    json: true,
    body: {
      text: error.message
    }
  }, (err) => {
    if (err) {
      console.error(err)
    }
  });
}

/**
 * Vlille station state fetching
 */
request(VLILLE_URL, { json: true }, (error, response, body) => {
  if (error) {
    sendAlertToSlack(error);

    throw error;
  }

  if (!body.records) {
    throw "No data";
  }

  // formats entries
  const data = prepareData(body);

  // manage data insertion
  storeDataToES(data);
});

/**
 * Removes useless data from dataset
 *
 * @param {Array} data
 */
function prepareData(data) {
  return data.records.map(record => {
    return {
      timestamp: record.record_timestamp,
      id: record.fields.libelle,
      bikes: record.fields.nbvelosdispo,
      docks: record.fields.nbplacesdispo,
      status: record.fields.etat,
      connexionStatus: record.fields.etatconnexion
    };
  });
}

/**
 * Perform ES indexation bulk request
 *
 * @param {Array} data
 */
async function storeDataToES(data) {
  try {
    await esClient.bulk({
      body: prepareEsBodyRequest(data)
    });
  } catch (error) {
    sendAlertToSlack(error)

    console.error(error.message)
  }
}

/**
 * Prepare data to indexation format for ES
 *
 * @param {Array} data
 */
function prepareEsBodyRequest(data) {
  const body = [];

  data.forEach(element => {
    body.push({
      index:  {
        _index: ELASTIC_INDEX,
        _type: '_doc'
      }
    });
    body.push(element);
  });

  return body;
}