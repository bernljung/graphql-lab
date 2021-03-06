'use strict'
const request = require('request-promise')
const Team = require('./team').Team

class User {
  constructor(params) {
    this.data = {
      id: params.id,
      username: params.username,
      firstname: params.firstname,
      lastname: params.lastname,
      age: params.age,
      teamId: params.teamId
    }
  }

  async fetchData() {
    if(this.data.id && this.data.username && this.data.teamId && this.data.firstname && this.data.lastname && this.data.age) {
      return
    }
    const options = {
      uri: `http://generic-mock/users/${this.data.id}`,
      method: 'GET',
      json: true
    }
    const res = await request(options)
    this.data.username = res.username
    this.data.firstname = res.firstname
    this.data.lastname = res.lastname
    this.data.age = res.age
    this.data.teamId = res.teamId
  }

  id() {
    return this.data.id
  }

  async username() {
    await this.fetchData()
    return this.data.username
  }

  async firstname() {
    await this.fetchData()
    return this.data.firstname
  }

  async lastname() {
    await this.fetchData()
    return this.data.lastname
  }

  async age() {
    await this.fetchData()
    return this.data.age
  }

  async teamId() {
    await this.fetchData()
    return this.data.teamId
  }

  async team() {
    await this.fetchData()
    return new Team({ id: this.data.teamId })
  }
}

const getById = id => {
  return new User({ id })
}

const getAllUsers = async () => {
  const options = {
    uri: `http://generic-mock/users`,
    method: 'GET',
    json: true
  }
  const res = await request(options)
  const users = res.map(u => {
    return new User({
      id: u.id,
      username: u.username,
      teamId: u.teamId
    })
  })
  return users
}

const createUser = async input => {
  const options = {
    uri: `http://generic-mock/users`,
    method: 'POST',
    json: true,
    body: input
  }
  const res = await request(options)
  return new User(res)
}

const updateUser = async (id, input) => {
  const options = {
    uri: `http://generic-mock/users/${id}`,
    method: 'PUT',
    json: true,
    body: input
  }
  const res = await request(options)
  return new User(res)
}

const deleteUser = async id => {
  const options = {
    uri: `http://generic-mock/users/${id}`,
    method: 'DELETE',
    json: true,
  }
  await request(options)
  return {
    status: 'ok'
  }
}

module.exports = {
  User,
  getById,
  all: getAllUsers,
  create: createUser,
  update: updateUser,
  delete: deleteUser
}