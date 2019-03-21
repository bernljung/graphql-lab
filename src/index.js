'use strict';

const Hapi = require('hapi')
const DataLoader = require('dataloader')
const { graphql, buildSchema } = require('graphql')
const user = require('./modules/user')
const team = require('./modules/team')

const schema = buildSchema(`
  input TeamInput {
    name: String
  }

  type Team {
    id: String
    name: String
  }

  type Status {
    status: String
  }

  input UserInput {
    username: String
    firstname: String
    lastname: String
    age: Int
    teamId: String
  }

  type User {
    id: String
    username: String
    firstname: String
    lastname: String
    age: Int
    teamId: String
    team: Team
  }

  type Query {
    allUsers: [User]
    allTeams: [Team]
    getUser(id: String): User
    getTeam(id: String): Team
  }

  type Mutation {
    createUser(input: UserInput): User
    updateUser(id: String, input: UserInput): User
    deleteUser(id: String): Status

    createTeam(input: TeamInput): Team
    updateTeam(id: String, input: TeamInput): Team
    deleteTeam(id: String): Status
  }
`)

const root = {
  allUsers: () => {
    return user.all()
  },
  getUser: (args) => {
    return user.getById(args.id)
  },
  createUser: (args) => {
    const input = JSON.parse(JSON.stringify(args.input))
    return user.create(input)
  },
  updateUser: (args) => {
    const input = JSON.parse(JSON.stringify(args.input))
    return user.update(args.id, input)
  },
  deleteUser: (args) => {
    return user.delete(args.id)
  },

  allTeams: () => {
    return team.all()
  },
  getTeam: (args) => {
    return team.getById(args.id)
  },
  createTeam: (args) => {
    const input = JSON.parse(JSON.stringify(args.input))
    return team.create(input)
  },
  updateTeam: (args) => {
    const input = JSON.parse(JSON.stringify(args.input))
    return team.update(args.id, input)
  },
  deleteTeam: (args) => {
    return team.delete(args.id)
  },
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