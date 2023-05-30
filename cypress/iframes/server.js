const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  switch (req.url) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(fs.readFileSync('./index.html'))
      break
    case '/top.html':
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(fs.readFileSync('./top.html'))
      break
    case '/middle.html':
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(fs.readFileSync('./middle.html'))
      break
    case '/bottom.html':
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(fs.readFileSync('./bottom.html'))
      break
    default:
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.write('<h1>404 Not Found</h1>')
  }

  res.end()
})

server.listen(6070)
server.on('listening', () => console.log('listening @ http://localhost:6070/'))