import express from 'express'
import graphqlHTTP from 'express-graphql'
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql'

import axios from 'axios'

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User data',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: user => user.id,
    },
    email: {
      type: GraphQLString,
      resolve: user => user.email,
    },
    username: {
      type: GraphQLString,
      resolve: user => user.username,
    },
  }),
})

const query = new GraphQLObjectType({
  name: 'Query',
  description: 'Application queries',
  fields: () => ({
    users: {
      description: 'Users List',
      type: GraphQLList(UserType),
      args: {
       id: { type: GraphQLInt },
      },
      resolve: (obj, args, context) => axios('https://jsonplaceholder.typicode.com/users').then(function(res){
        return args.id ? res.data.filter(userData => userData.id === args.id) : res.data
      }),
    },
  }),
})

var app = express()
app.use('/graphql', graphqlHTTP({
  schema: new GraphQLSchema({
    query,
  }),
  graphiql: true,
}))
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'))
