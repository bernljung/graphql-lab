'use strict'

const Hapi = require('hapi')
const uuid = require('uuid')

// Create a server with a host and port
const server = Hapi.server({
  port: 80
})

const ENTITITES = new Map()

const INITIAL_DATA = JSON.parse(process.env.INITIAL_DATA)
Object.keys(INITIAL_DATA).forEach(key => {
  ENTITITES.set(key, new Map())
  const entity = ENTITITES.get(key)
  INITIAL_DATA[key].forEach(item => {
    entity.set(item.id, item)
  })
})

// Add the routes
server.route([{
    method: 'GET',
    path: '/{entity}',
    handler: (request, h) => {
      const entityName = request.params.entity
      const entity = ENTITITES.get(entityName)
      if(!entity) {
        return h.response('Not found').code(404)
      }

      const items = []
      entity.forEach(value => {
        items.push(value)
      })

      return h.response(items)
    }
  },
  {
    method: 'GET',
    path: '/{entity}/{id}',
    handler: (request, h) => {
      const entityName = request.params.entity
      const id = request.params.id

      const entity = ENTITITES.get(entityName)
      if(!entity) {
        return h.response('Entity not found').code(404)
      }

      const item = entity.get(id)
      if(!item) {
        return h.response('Item not found').code(404)
      }

      return h.response(item)
    }
  },
  {
    method: 'POST',
    path: '/{entity}',
    handler: (request, h) => {
      const entityName = request.params.entity
      const item = request.payload
      item.id = uuid.v4()

      let entity = ENTITITES.get(entityName)
      if(!entity) {
        ENTITITES.set(entityName, new Map())
      }

      entity = ENTITITES.get(entityName)
      entity.set(item.id, item)

      return h.response(item)
    }
  },
  {
    method: 'PUT',
    path: '/{entity}/{id}',
    handler: (request, h) => {
      const entityName = request.params.entity
      const id = request.params.id
      const payload = request.payload

      const entity = ENTITITES.get(entityName)
      if(!entity) {
        return h.response('Entity not found').code(404)
      }

      const item = entity.get(id)
      if(!item) {
        return h.response('Item not found').code(404)
      }

      const updatedItem = Object.assign({}, item, payload)
      entity.set(id, updatedItem)
      return h.response(updatedItem)
    }
  },
  {
    method: 'DELETE',
    path: '/{entity}/{id}',
    handler: (request, h) => {
      const entityName = request.params.entity
      const id = request.params.id

      const entity = ENTITITES.get(entityName)
      if(!entity) {
        return h.response('Entity not found').code(404)
      }

      const item = entity.delete(id)
      return h.response().code(201)
    }
  },
])

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