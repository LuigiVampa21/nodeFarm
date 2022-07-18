const { log } = require('console');
const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////////////////////////////////////////////
// Blocking Sync way

// const txtInput = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(txtInput);
// var dateObj = new Date();
// var month = dateObj.getUTCMonth() + 1;
// var day = dateObj.getUTCDate();
// var year = dateObj.getUTCFullYear();
// console.log(dateObj);
// console.log(month, day, year);
// const txtOutput = `This is what we know about avocado: ${txtInput}. Created on ${month}/${day}/${year}`;
// fs.writeFileSync("./txt/output.txt", txtOutput);

// Async way

// fs.readFile('./txt/starttttt.txt', 'utf-8', (err, data) => {
//   if (err) return console.log('ERROR');
//   console.log(data);
//   fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data1) => {
//     // console.log(data1);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data2) => {
//     //   console.log(data2);
//       fs.writeFile('./txt/final.txt', `${data1}/n${data2}`, 'utf-8', (err) => {
//         // console.log(err);
//       });
//     });
//   });
// });

////////////////////////////////////////////////////////////////////////////

const http = require('http');
const url = require('url');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const dataObj = JSON.parse(data);
// console.log(dataObj);

const server = http.createServer((req, res) => {
  //   console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  //   console.log(query, pathname);

  //   const pathName = req.url;
  // console.log(pathName);
  // Overview Page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, { 'Content-type': 'text.html' });
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    // console.log(cardHtml);
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);
    // Products Page
  } else if (pathname === '/product') {
    // console.log('hey');
    res.writeHead(200, { 'Content-type': 'text.html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    // console.log(output);
    res.end(output);
    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application.json' });
    res.end(data);
    // NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text.html',
      'my-own-header': 'hello-world',
    });
    res.end(`<h1>Page not found</h1>`);
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log(`Listening on port 8000`);
});
