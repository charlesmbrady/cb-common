const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

request(
  'https://www.nationsonline.org/oneworld/country_code_list.htm',
  (error, response, html) => {
    if (error) {
      console.log(error);
    }
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);
      let countries = [];
      $('tr').each((i, el) => {
        let name = $(el).find('.abs');
        let codeOne = name.next();
        let codeTwo = name.next().next();
        let codeThree = name.next().next().next();
        let country = {
          name: name.text(),
          twoLetterCode: codeOne.text().trim(),
          threeLetterCode: codeTwo.text().trim(),
          threeDigitCode: codeThree.text().trim(),
        };
        if (country.twoLetterCode === '') {
          return 0;
        }
        if (i > 199) {
          countries.push(country);
        }
      });
      const output = `${JSON.stringify(countries)};`;
      console.log(countries);
      // fs.writeFile('./data/newCities.js', output, (err) => {
      //     if(err){
      //         console.log('there was an error')
      //     }
      //     else{
      //         console.log('success!');
      //     }
      // });
    }
  }
);
