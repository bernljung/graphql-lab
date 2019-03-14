'use strict'

const Hapi = require('hapi')

// Create a server with a host and port
const server = Hapi.server({
  port: 80
})

const config = JSON.parse(process.env.CONFIG)

const routes = config.routes.map(route => {
  return {
    method: route.method || 'GET',
    path: route.path,
    handler: (request, h) => {
      console.log(request.path)
      return h.response(route.body).code(route.code || 200)
    }
  }
})

// Add the routes
server.route(routes)

// Start the server
const start =  async function() {

  try {
    await server.start()
  }
  catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
}

start()