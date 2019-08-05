var express = require('express');
var bodyParser = require('body-parser');
const admin = require("firebase-admin");

function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

const app = express();

// TODO: Set the following config vars within your Heroku env so you do not expose your firebase private key
// To do this, go to the 'Settings' tab of your Heroku app or see here for more details https://devcenter.heroku.com/articles/config-vars

// TODO: Enter your database url from firebase
admin.initializeApp({
	credential: admin.credential.cert({
		"type": "service_account",
		"project_id": process.env.FIREBASE_PROJECT_ID,
		"private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
		"private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
		"client_email": process.env.FIREBASE_CLIENT_EMAIL,
		"client_id": process.env.FIREBASE_CLIENT_ID,
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://oauth2.googleapis.com/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_x509_cert_url": process.env.FIREBASE_CERT_URL
	}),
	databaseURL: "https://" + process.env.FIREBASE_PROJECT_ID + ".firebaseio.com"
});


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
