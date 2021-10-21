const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const app = express();

const pl = [];

app.get('/', (req, res) => {
    axios.get('https://footystats.org/england/premier-league')
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('table.full-league-table > tbody > tr', html).each(function() {
                const image = $(this).find('td.crest > span > a > img').attr('src').replace('_thumb', '');
                const rank = $(this).find('td.position > span').text();
                const name = $(this).find('td.team > a').text();
                const played = $(this).find('td.mp').text();
                const win = $(this).find('td.win').text();
                const draw = $(this).find('td.draw').text();
                const lost = $(this).find('td.loss').text();
                const goalScored = $(this).find('td.gf').text();
                const goalReceived = $(this).find('td.ga').text();
                const goalDifference = $(this).find('td.gd').text();
                const points = $(this).find('td.points').text();
                const form = []
                $(this).find('td.form > .form-run').each(function() {
                    const formRun = $(this).find('.form-run').text();
                    form.push(formRun)
                })
                const averageGoalPerGame = $(this).find('td.avg').text();

                pl.push({
                    rank,
                    name,
                    image,
                    played,
                    win,
                    draw,
                    lost,
                    goalScored,
                    goalReceived,
                    goalDifference,
                    points,
                    form,
                    averageGoalPerGame
                })
            })
            res.json({pl});
        })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));