'use strict';

const Hapi = require('hapi')
const request = require('request-promise')
const DataLoader = require('dataloader')
const { graphql, buildSchema } = require('graphql')

const schema = buildSchema(`
  type Team {
    id: Int
    name: String
  }

  type User {
    id: Int
    username: String
    teamId: Int
    team: Team
  }

  type Query {
    user(id: Int): User
    team(id: Int): Team
  }
`)

class Team {
  constructor(id) {
    this.id = id
    this.data = {
      name: null
    }
  }

  async fetchData() {
    const options = {
      uri: `http://generic-mock/teams/${this.id}`,
      method: 'GET',
      json: true
    }
    const res = await request(options)
    this.data.name = res.name
  }

  async name() {
    await this.fetchData()
    return this.data.name
  }
}

class User {
  constructor(id) {
    this.id = id
    this.data = {
      username: null,
      teamId: null
    }
  }

  async fetchData() {
    const options = {
      uri: `http://generic-mock/users/${this.id}`,
      method: 'GET',
      json: true
    }
    const res = await request(options)
    this.data.username = res.username
    this.data.teamId = res.teamId
  }

  async username() {
    await this.fetchData()
    return this.data.username
  }

  async teamId() {
    await this.fetchData()
    return this.data.teamId
  }

  async team() {
    await this.fetchData()
    return new Team(this.data.teamId)
  }
}

const root = {
  user: (args) => {
    return new User(args.id)
  },
  team: (args) => {
    return new Team(args.id)
  }
}

const server=Hapi.server({
  host: '0.0.0.0',
  port: 80
})

server.route([{
  method:'GET',
  path:'/graph',
  handler: async (request,h) => {
    const params = request.query
    const res = await graphql(schema, params.query, root)
    return res
  }
},
{
  method:'POST',
  path:'/graph',
  handler: async (request,h) => {
    const payload = request.payload
    const res = await graphql(schema, payload.query, root)
    return res
  }
}])

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