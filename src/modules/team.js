'use strict'
const request = require('request-promise')

class Team {
  constructor(params) {
    this.data = {
      id: params.id,
      name: params.name
    }
  }

  async fetchData() {
    if(this.data.id && this.data.name) {
      return
    }
    const options = {
      uri: `http://generic-mock/teams/${this.data.id}`,
      method: 'GET',
      json: true
    }
    const res = await request(options)
    this.data.name = res.name
  }

  id() {
    return this.data.id
  }

  async name() {
    await this.fetchData()
    return this.data.name
  }
}

const getById = id => {
  return new Team({ id })
}

const getAllTeams = async () => {
  const options = {
    uri: `http://generic-mock/teams`,
    method: 'GET',
    json: true
  }
  const res = await request(options)
  const teams = res.map(t => {
    return new Team({
      id: t.id,
      name: t.name
    })
  })
  return teams
}

const createTeam = async input => {
  const options = {
    uri: `http://generic-mock/teams`,
    method: 'POST',
    json: true,
    body: input
  }
  const res = await request(options)
  return new Team(res)
}

const updateTeam = async (id, input) => {
  const options = {
    uri: `http://generic-mock/teams/${id}`,
    method: 'PUT',
    json: true,
    body: input
  }
  const res = await request(options)
  return new Team(res)
}

const deleteTeam = async id => {
  const options = {
    uri: `http://generic-mock/teams/${id}`,
    method: 'DELETE',
    json: true,
  }
  await request(options)
  return {
    status: 'ok'
  }
}

module.exports = {
  Team,
  getById,
  all: getAllTeams,
  create: createTeam,
  update: updateTeam,
  delete: deleteTeam
}