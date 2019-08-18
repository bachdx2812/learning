const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')
const bodyParser = require('body-parser');

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

const QUESTION_TYPE_NAME = 1;
const QUESTION_TYPE_RADIO = 2;
const QUESTION_TYPE_CHECKBOX = 3;
const QUESTION_TYPE_ADDRESS = 4;

app.get('/', (req, res) => {
  let data = [
    {
      content: 'Hello! Welcome to my dummy chatbot',
      isQuestion: false
    },
    {
      content: 'What is your name?',
      isQuestion: true,
      questionType: QUESTION_TYPE_NAME
    },
    {
      content: 'Can you tell me your gender',
      isQuestion: true,
      questionType: QUESTION_TYPE_RADIO,
      options: ['male', 'female', 'other']
    },
    {
      content: 'Can you tell me about your hobbies',
      isQuestion: true,
      questionType: QUESTION_TYPE_CHECKBOX,
      options: ['books', 'game', 'macbook pro', 'redbull', 'malboro']
    },
    {
      content: 'Where do you live?',
      isQuestion: true,
      questionType: QUESTION_TYPE_ADDRESS,
      location: 'jp'
    }
  ]

  res.send(JSON.stringify(data));

})

app.post('/', (req, res) => {
  console.log(req.body);
  console.log("abc")
  res.send('OK');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
