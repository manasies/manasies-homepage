const TeemoJS = require('teemojs');
let express = require('express');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let api = TeemoJS('RGAPI-d5a4587e-5e22-4ec8-b474-926278815a0e');
const SUMMONER_NAME = 'ASTRAL OCEAN';
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

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// LEAGUE API

// https://www.youtube.com/watch?v=bSMZgXzC9AA
// DARK / LIGHT MODE
// ANIM DE CURSEUR ?


async function getLeagueData() {
    data = await api.get('euw1', 'summoner.getBySummonerName', SUMMONER_NAME);
    console.log(data)
    if (data.status) {
        console.log('No League data found through API, probably a key error');
        return;
    }
    if (data)
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