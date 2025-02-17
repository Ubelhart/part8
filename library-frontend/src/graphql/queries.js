import { gql } from '@apollo/client'

export const GET_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
      id
    }
  }
`
export const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`
