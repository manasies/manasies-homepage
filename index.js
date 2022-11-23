const TeemoJS = require('teemojs');
let express = require('express');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();
let api = TeemoJS(process.env.LEAGUE_API_KEY);
const SUMMONER_NAME = process.env.LEAGUE_SUMMONER;
let summoner = {
    "name": SUMMONER_NAME,
    "profileIconId": '',
    "rank": '',
    "tier": '',
    "leaguePoints": '',
    "wins": '',
    "losses": '',
    "winrate": ''
}

console.log("ici")
console.log(summoner)
console.log("ici")
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
});

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// https://www.youtube.com/watch?v=bSMZgXzC9AA
// ANIM DE CURSEUR ?

// WHY FOOTER WEIRD ON SOME SCREEN SIZES ????
//


async function getLeagueData() {
    data = await api.get('euw1', 'summoner.getBySummonerName', SUMMONER_NAME);
    console.log(data)
    if (data == null)
        return;
    if (data.status) {
        console.log('No League data found through API, probably a key error');
        return;
    }
    summoner.profileIconId = 'http://ddragon.leagueoflegends.com/cdn/12.3.1/img/profileicon/' + data.profileIconId + '.png';
    let summonerId = data.id;
    accdata = await api.get('euw1', 'league.getLeagueEntriesForSummoner', summonerId);
    console.log(accdata);
    
    for await (const queue of accdata) {
        if (queue['queueType'] === "RANKED_SOLO_5x5") {
            summoner.rank = queue.rank;
            summoner.tier = queue.tier;
            summoner.leaguePoints = queue.leaguePoints;
            summoner.wins = queue.wins;
            summoner.losses = queue.losses;
            summoner.winrate = Math.round((queue.wins / (queue.wins + queue.losses)) * 100) + '%';
            break;
        }
    }
    console.log(summoner);
    return;
}

// ROUTES

app.get('/', function(req, res) {
    res.render('index.pug');
});

app.get('/about', async function(req, res) {
    await getLeagueData();
    res.render('aboutme.pug', { leaguesumm: summoner });
});

app.get('/skills', function(req, res) {
    res.render('skills.pug', { randomVar: 'random value' });
});

app.get('/work', function(req, res) {
    res.render('work.pug', { randomVar: 'random value' });
});

app.get('/contact', function(req, res) {
    res.render('contact.pug', { randomVar: 'random value' });
});

// Honestly who is going to use a contact form ???

// app.post('/contact', function(req, res) {
//     let form = new multiparty.Form();
//     let data = {};
//     form.parse(req, function (err, fields) {
//         // console.log(fields);
//         Object.keys(fields).forEach(function (property) {
//             data[property] = fields[property].toString();
//         });

//         const mail = {
//             from: process.env.EMAIL,
//             to: process.env.EMAIL,
//             subject: data.subject,
//             text: `${data.name} <${data.email}> \n${data.formContent}`,
//         };
//         //3.
//         transporter.sendMail(mail, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send("Something went wrong.");
//         } else {
//             console.log('here');
//             res.status(200).send("Email successfully sent to recipient!");
//         }
//         });
//     });
// })

app.get('*', function(req, res){
    res.status(404).send('Use real route pls no break website i work hard for this :(');
  });

// APP RUN

app.listen(app.get('port'), function(err) {
if (err) {
    console.log(err);
} else {
    console.log('Running on port: ' + app.get('port')); }
});