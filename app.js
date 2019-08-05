var express = require('express');
var bodyParser = require('body-parser');
//var admin = require("firebase-admin");
var firebase = require("firebase/app");

function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

const app = express();

// TODO: Set the following config vars within your Heroku env so you do not expose your firebase private key
// To do this, go to the 'Settings' tab of your Heroku app or see here for more details https://devcenter.heroku.com/articles/config-vars

// TODO: Enter your database url from firebase
/*
admin.initializeApp({
	credential: admin.credential.cert({
		"projectId" : process.env.FIREBASE_PROJECT_ID,
		"private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,'\n'),
		"clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
	}),
	databaseURL: "https://madden-cfm-f7700.firebaseio.com"
});
*/

var firebaseConfig = {
 	apiKey: process.env.FIREBASE_API_KEY,
 	authDomain: process.env.FIREBASE_PROJECT_ID + ".firebaseapp.com ",
 	databaseURL: "https://madden-cfm-f7700.firebaseio.com",
 	projectId: process.env.FIREBASE_PROJECT_ID,
 	storageBucket: process.env.FIREBASE_PROJECT_ID + ".appspot.com ",
 	messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
 	appId: process.env.FIREBASE_APP_ID
 };

firebase.initializeApp(firebaseConfig);

// Setup
// Change the default port here if you want for local dev.
app.set('port', (process.env.PORT || 1322));
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/delete', function(req, res) {
	const db = admin.database();
	const ref = db.ref();
	ref.remove();
	return res.send('Database cleared');
});

app.post('/:platform/:leagueId/leagueteams', (req, res) => {
	const db = admin.database();
	const ref = db.ref();
	const {platform, leagueId} = req.params;
	const dataRef = ref.child(`data/${platform}/${leagueId}/leagueteams`);
	const {body: {leagueTeamInfoList}} = req;

	dataRef.set({
		leagueTeamInfoList
	});
	res.sendStatus(200);
});

app.post('/:platform/:leagueId/standings', (req, res) => {
	const db = admin.database();
	const ref = db.ref();
	const {platform, leagueId} = req.params;
	const dataRef = ref.child(`data/${platform}/${leagueId}/standings`);
	const {body: {teamStandingInfoList}} = req;

	dataRef.set({
		teamStandingInfoList
	});
	res.sendStatus(200);
});


app.post('/:platform/:leagueId/week/:weekType/:weekNumber/:dataType', (req, res) => {
	const db = admin.database();
	const ref = db.ref();
	const {platform, leagueId, weekType, weekNumber, dataType} = req.params;
	const dataRef = ref.child(`data/${platform}/${leagueId}/week/${weekType}/${weekNumber}/${dataType}`);

	// method=POST path="/platform/leagueId/week/reg/1/defense"
	// method=POST path="/platform/leagueId/week/reg/1/kicking"
	// method=POST path="/platform/leagueId/week/reg/1/passing"
	// method=POST path="/platform/leagueId/week/reg/1/punting"
	// method=POST path="/platform/leagueId/week/reg/1/receiving"
	// method=POST path="/platform/leagueId/week/reg/1/rushing"

	switch(dataType) {
		case 'schedules':
			const {body: {gameScheduleInfoList}} = req;
			dataRef.set({
				gameScheduleInfoList
			});
			break;
		case 'teamstats':
			const {body: {teamStatInfoList}} = req;
			dataRef.set({
				teamStatInfoList
			});
			break;
		case 'defense':
			const {body: {playerDefensiveStatInfoList}} = req;
			dataRef.set({
				playerDefensiveStatInfoList
			});
			break;
		default:
			const {body} = req;
			const property = `player${capitalizeFirstLetter(dataType)}StatInfoList`;
			dataRef.set({
				[property]: body[property] || ''
			});
		break;
	}

	res.sendStatus(200);
});


// ROSTERS

app.post('/:platform/:leagueId/freeagents/roster', (req, res) => {
	const db = admin.database();
	const ref = db.ref();
	const {platform, leagueId} = req.params;
	const dataRef = ref.child(`data/${platform}/${leagueId}/freeagents`);
	const {body: {rosterInfoList}} = req;
	dataRef.set({
		rosterInfoList
	});
	res.sendStatus(200);
});

app.post('/:platform/:leagueId/team/:teamId/roster', (req, res) => {
	const db = admin.database();
	const ref = db.ref();
	const {platform, leagueId, teamId} = req.params;
	const dataRef = ref.child(`data/${platform}/${leagueId}/team/${teamId}`);
	const {body: {rosterInfoList}} = req;
	dataRef.set({
		rosterInfoList
	});
	res.sendStatus(200);
});


app.listen(app.get('port'), function() { console.log('Madden Companion Exporter is running on port', app.get('port')) });
