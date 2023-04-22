//A express server which will handle api request coning in and respond back with a json object it will use body parser as well as ports
///=========open ai api k ========///

const OpenAI = require('openai');

const { Configuration, OpenAIApi } = OpenAI;



//===========express server =========//
//==dependencies==//

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;
require('dotenv').config();

const ORGANIZATION = process.env.ORGANIZATION;
const API_KEY = process.env.API_KEY;

//console.log(ORGANIZATION, API_KEY);

//==open ai config==//
const configuration = new Configuration({
    organization: ORGANIZATION,
    apiKey: API_KEY
});
const openai = new OpenAIApi(configuration);
//const response = await openai.listEngines();

app.use(bodyParser.json());
app.use(cors());

app.post('/', async (req, res) => {
    const { text } = req.body;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: 'extract keywords from text: ' + text + '\n\nKeywords:\n',
      max_tokens: 100,
      temperature: 0,
      top_p: 1.0,
      frequency_penalty: 0.8,
      presence_penalty: 0.0,
    });
  
    console.log(response.data);
    if (response.data) {
      if (response.data.choices) {
        res.json({
          keywords: response.data.choices[0].text
        });
      }
    }
  });
  

app.listen(port, () => {
    console.log('app listening on port', port)
});