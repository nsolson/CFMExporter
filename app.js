var express = require('express');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");

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
		"project_id": "madden-cfm-f7700",
		"private_key_id": "25cb992b2b24274ad9a991e50950f64b0f4b3542",
		"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOttA44lU0vSt0\nN+b6mHDrxjlwDM8k1398rhthitCSWEOAG4Xi8QfZGjutXgfFBO/rPmeVSontgwO3\ntn5UhbqgovZEB13FZMalWqVk7j/TNjB4meOhEbEauGlnDIXTA9EgdE5CiSzfDUg6\n0IGg5wC3NC8W8NzE5iW6qjJZl6fz5fFfvpUDdZBy/O/DmAW606BlicFV0+8BJDj5\nm81GM/a1su2aIsMC3Og0OofaKtuxDoi9wa/aArJlR86r948xw7heCXGAiXp/BysF\nJAww7prCWUPisBtvrjuiI1ppd1SbvGEus/4/Rqm2CChYhLQuJMgdNPzTOH7oMHan\nOwizr1VtAgMBAAECggEAMTVBshjm8awKmRrpqEP7tZS1fZ/++6U1GwgTSpASAJR0\nVR24LIL2PE9LX4Tf0p3PQy/S1q4s0VZ73xLZVeOTvsOsXhtmziOkSh6e+rzggrYG\nqd7wWhptD5BQvxAzFz10XgZxztL61IpD5IRYJ2Z2PCZ3Az4JP/INjzcOz1cTyzJG\nx/uReJLB39ydfpMgX9h5WmjtFxUtdjrcvpLk6emefv2dNs9RSDdT5RXqR/2iBmZU\nF9N+QjUPH0DAYfpJrKrkFDlA6iK8mO10/lp2RvgpthKiSTUYBx1cSpNipe3j+0nN\nHqQCzcR8LiDYrjRm7GnzAZ1nsxK4M4RmaSKBDMNmIQKBgQD+D0Cvl4MI826dbdgy\n9OgYJcBemQlHK2fQI4VgkGRTj8czJytDuUdMcr8IORAfFbjvvTeFEbEtBvmHMEUu\nIc49C4E30G8NIXh21fdby8TqXyFSB/YCgvqnJ18iyDGgWW77426jOvtgTAQgmqcG\nPZe1Il4M2aJe672gFCWI8vSsxQKBgQDQSv0syHE726tPkzly/jj2yJG3q96NEJcp\nOh/A5IDAZU7JjhUdRDmZpgyhx0YOiZLk9TD7UMngiGXAGGTJJYtNSu3gyviHuWHo\nc2FRxcoYH2j4NRYRLRGEGq3yQ1qDMUofoTQq9TWUCHqfaT4IPhYuvCZR6eRxCzDK\n1Uvor3FgiQKBgQCz5I70Bn91JhGsDWxp4Ho7JvgIw6oLJ9PxUEWP843mkUcGlHSR\nFq9ClXlo1CbzK8lwj/WxFq7y6B5luCs0GCHVncDYiZEopguLccQdzrJXFhcc46Ax\ndRcQptM5aLGjDdCFMSxVDl2SeSDvCTK9O32hd31K8guD1L7Hi5xsVUQk1QKBgBU+\nUKvslX/hW4t2HHnZ671fn1z4Lm58rq4Ju4tUwrzcmDh+QTEG8Ej3YnptdHuvFEg9\nqY04JB6+SoJY+o55QcfUSIaQrOBKy+2FNvu8DGyBZ5dI8sM1sX+jqPH4ZJbUxBaN\nvmBTOe+rHbZ8aVM14dVKYy4fiKju1z8YmfFVU17hAoGBAPKDlBxhCcawLusza4qj\np4PIxJYxVFQwS/QuWjpJgnYbuTHpi3Ls4qhQbwRQubdNaFCCyg7/n+4hPSsKWELG\npVGK3vLhpu9lFk5jwVrVB3gYRkD70nvf8BHFfZ4bw0c38BaVHsEbINlsJytfWqad\n4MG0gXdo28nW7bsPV8FIidTI\n-----END PRIVATE KEY-----\n",
		"client_email": "firebase-adminsdk-atakm@madden-cfm-f7700.iam.gserviceaccount.com",
		"client_id": "117216417204021598373",
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://oauth2.googleapis.com/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-atakm%40madden-cfm-f7700.iam.gserviceaccount.com"
	}),
	databaseURL: "https://madden-cfm-f7700.firebaseio.com"
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
