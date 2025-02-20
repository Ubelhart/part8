const { GraphQLError } = require('graphql')
const { ApolloServer } = require('@apollo/server')
const { gql } = require('graphql-tag')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const jwt = require('jsonwebtoken')
const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to mongodb', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch((error) => {
    console.log('error connecting to mongodb', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String
    id: ID!
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author]
    me: User
  }

  input BookInput {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
  }

  type Mutation {
    addBook(book: BookInput!): Book!

    addAuthor(name: String!): Author

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(username: String!, favoriteGenre: String!): User

    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments(),
    authorCount: async () => await Author.countDocuments(),
    allBooks: async (root, args) => {
      if (args.genre) {
        return Book.find({ genres: args.genre }).populate('author')
      }
      return Book.find().populate('author')
    },
    allAuthors: async () => await Author.find(),
    me: async (root, args, { currentUser }) => {
      return currentUser
    },
  },
  Mutation: {
    addBook: async (root, { book }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('You must be logged in to add a book', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      let author = await Author.findOne({ name: book.author })
      if (!author) {
        author = await Author.create({ name: book.author })
      }

      try {
        const newBook = await Book.create({
          ...book,
          author: author.id,
        })
        return newBook.populate('author')
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: book },
        })
      }
    },
    addAuthor: async (root, { name }) => {
      try {
        return await Author.create({ name })
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: name },
        })
      }
    },
    editAuthor: async (root, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('You must be logged in to edit an author', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }
      return await Author.findOneAndUpdate({ name }, { born: setBornTo })
    },
    createUser: async (root, { username, favoriteGenre }) => {
      const user = await User.create({ username, favoriteGenre })
      return user
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username })
      const isMatch = password === 'password'
      if (!user || !isMatch) {
        throw new GraphQLError('Incorrect username or password', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
      return { value: token }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.userId)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
