// import pdf from 'html-pdf';
const fs = require('fs');
const pdf = require('html-pdf');
const html = fs.readFileSync('./html.html', 'utf8');

pdf.create(html).toFile('relatorio.pdf', (err, arquivo) => {
  if (err) {
    return console.log(err);
  }
  return console.log(arquivo);
});
