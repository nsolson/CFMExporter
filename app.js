var express = require('express');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");

const app = express();

// TODO: Enter the path to your service account json file
// Need help with this step go here: https://firebase.google.com/docs/admin/setup
const serviceAccount = require("./maddenexporter-3aa2f-firebase-adminsdk-qv7xi-be56f0355f.json");

// TODO: Enter your database url from firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://maddenexporter-3aa2f.firebaseio.com"
});

// Setup
// Change the default port here if you want for local dev.
app.set('port', (process.env.PORT || 1322));
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  ref.child("data").remove();
  ref.child("Teams").remove();
  ref.child("Standings").remove();
  ref.child("Rosters").remove();
  ref.child("FreeAgents").remove();
  ref.child("Preseason").remove();
  ref.child("PreDefense").remove();
  ref.child("PreKicking").remove();
  ref.child("PrePassing").remove();
  ref.child("PrePunting").remove();
  ref.child("PreReceiving").remove();
  ref.child("PreRushing").remove();
  ref.child("PreTeamStats").remove();
  ref.child("RegularSeason").remove();
  return res.send('Testing');
});

//Teams Post
app.post('/xbox/4720274/leagueteams', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const teamRef = ref.child("Teams");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newTeamsRef = teamRef.push();
  newTeamsRef.set({
    Teams: req.body.leagueTeamInfoList
  });
  res.send('Got a POST request');
});

//Standings Post
app.post('/xbox/4720274/standings', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const standRef = ref.child("Standings");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newStandRef = standRef.push();
  newStandRef.set({
    Standings: (req && req.body.teamStandingInfoList) || ''
  });
  res.send('Got a POST request');
});

//Rosters Post
app.post('/xbox/4720274/team/*', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const rostRef = ref.child("Rosters");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newRostRef = rostRef.push();
  newRostRef.set({
    Rosters: (req && req.body.rosterInfoList) || ''
  });
  res.send('Got a POST request');
});

app.post('/xbox/4720274/freeagents/roster', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const freeRef = ref.child("FreeAgents");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newFreeRef = freeRef.push();
  newFreeRef.set({
    FreeAgents: (req && req.body.rosterInfoList) || ''
  });
  res.send('Got a POST request');
});

app.post('/xbox/4720274/week/pre/*/schedules', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const preRef = ref.child("Preseason");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newPreRef = preRef.push();
  newPreRef.set({
    Preseason: (req && req.body.gameScheduleInfoList) || ''
  });
  res.send('Got a POST request');
}); 

app.post('/xbox/4720274/week/pre/*/defense', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const defRef = ref.child("PreDefense");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newDefRef = defRef.push();
  newDefRef.set({
    PreDefense: (req && req.body.playerDefensiveStatInfoList) || ''
  });
  res.send('Got a POST request');
});

app.post('/xbox/4720274/week/pre/*/kicking', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const kickRef = ref.child("PreKicking");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newKickRef = kickRef.push();
  newKickRef.set({
    PreKicking: (req && req.body.playerKickingStatInfoList) || ''
  });
  res.send('Got a POST request');
}); 

app.post('/xbox/4720274/week/pre/*/passing', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const passRef = ref.child("PrePassing");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newPassRef = passRef.push();
  newPassRef.set({
    PrePassing: (req && req.body.playerPassingStatInfoList) || ''
  });
  res.send('Got a POST request');
});

app.post('/xbox/4720274/week/pre/*/punting', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const puntRef = ref.child("PrePunting");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newPuntRef = puntRef.push();
  newPuntRef.set({
    PrePunting: (req && req.body.playerPuntingStatInfoList) || ''
  });
  res.send('Got a POST request');
});

app.post('/xbox/4720274/week/pre/*/receiving', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const recRef = ref.child("PreReceiving");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newRecRef = recRef.push();
  newRecRef.set({
    PreReceiving: (req && req.body.playerReceivingStatInfoList) || ''
  });
  res.send('Got a POST request');
});

app.post('/xbox/4720274/week/pre/*/rushing', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const rushRef = ref.child("PreRushing");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newRushRef = rushRef.push();
  newRushRef.set({
    PreRushing: (req && req.body.playerRushingStatInfoList) || ''
  });
  res.send('Got a POST request');
});

app.post('/xbox/4720274/week/pre/*/teamstats', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const tstatsRef = ref.child("PreTeamStats");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newTstatsRef = tstatsRef.push();
  newTstatsRef.set({
    PreTeamStats: (req && req.body.teamStatInfoList) || ''
  });
  res.send('Got a POST request');
});

app.post('/xbox/4720274/week/reg/*/schedules', function(req, res) {
  const db = admin.database();
  const ref = db.ref();
  const regRef = ref.child("RegularSeason");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
  const newRegRef = regRef.push();
  newRegRef.set({
    RegularSeason: (req && req.body.gameScheduleInfoList) || ''
  });
  res.send('Got a POST request');
});

// This accepts all posts requests!
//app.post('/*', function(req, res) {
//  const db = admin.database();
//  const ref = db.ref();
//  const dataRef = ref.child("data");
  // Change what is set to the database here
  // Rosters are in the body under rosterInfoList
//  const newDataRef = dataRef.push();
//  newDataRef.set({
//    data: (req && req.body) || ''
//  });
//  res.send('Got a POST request');
//});

app.listen(app.get('port'), function() { console.log('Madden Companion Exporter is running on port', app.get('port')) });
