const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = {
    // To read the ".json" file
    "read": function(fileName) {
        return JSON.parse(fs.readFileSync('data/' + fileName + '.json').toString());
    },

    // To write in the ".json" file
    "write": function(fileName, data) {
        fs.writeFileSync('data/' + fileName + '.json', data);
        return true;
    },

    // To write in 'champions' file
    "champions": {
        "scrap": function (callback) {
            const stream = fs.createWriteStream('data/champions.json', {flags:'a'});
            const options = {
                url: "http://leagueoflegends.wikia.com/wiki/League_of_Legends_Wiki",
                transform: (body) => {
                    return cheerio.load(body);
                }
            }

            rp(options)
                .then(($) => {
                    fs.writeFileSync('data/champions.json', '');
                    stream.write('[');
                    let length = $('.lcs-container #left #tabber .tabbertab:nth-of-type(1) #champion-grid .champion_roster li a').length;
                    $('.lcs-container #left #tabber .tabbertab:nth-of-type(1) #champion-grid .champion_roster li a').each(function(i, el) {
                        stream.write(
                            JSON.stringify({
                                "id": i + 1,
                                "name": $(this).children('img').attr('alt'),
                                "img": ($(this).children('img').attr('data-src')).split('.png')[0] + '.png',
                                "url": (options.url).replace('/wiki/League_of_Legends_Wiki', '') + $(this).attr('href')
                            })
                        );
                        if(i !== length - 1) {
                            stream.write(',');
                        }
                    })
                    stream.write(']');
                    callback();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },

    // To load infos from the site
    "champion": {
        "scrap": function (url, callback) {
            const options = {
                url: url,
                transform: (body) => {
                    return cheerio.load(body);
                }
            }

            rp(options)
                .then(($) => {
                    let result = $('h1').text();
                    callback(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}