const TeemoJS = require('teemojs');
let express = require('express');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let api = TeemoJS('RGAPI-fbb44f8f-828e-42ce-8fd0-84472275f63b');
const SUMMONER_NAME = 'DlGlTALOVA';
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
// THREE JS EN HAUT DE PAGE ONLY
// ANIM DE CURSEUR ?
// ENLEVER TEXTE DEROULANT PARCE QUE C'EST TROP
// MATTEO BERNARDI EN HAUT A GAUCHE AVEC PETIT ICONE



async function getLeagueData() {
    data = await api.get('euw1', 'summoner.getBySummonerName', SUMMONER_NAME);
    if (data)
        summoner.profileIconId = 'http://ddragon.leagueoflegends.com/cdn/12.3.1/img/profileicon/' + data.profileIconId + '.png';
    let summonerId = data.id;
    console.log(data);
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

app.get('/', async function(req, res) {
    await getLeagueData();
    res.render('index.pug', { leaguesumm: summoner });
});

app.get('/test', function(req, res) {
    res.render('test.html', { msg: 'Test de message hihi sexe' });
});

// APP RUN

app.listen(app.get('port'), function(err) {
if (err) {
    console.log(err);
} else {
    console.log('Running on port: ' + app.get('port')); }
});