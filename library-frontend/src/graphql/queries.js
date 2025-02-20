import { gql } from '@apollo/client'

export const GET_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
        id
      }
      published
      id
      genres
    }
  }
`

export const GET_BOOKS_BY_GENRE = gql`
  query getBooksByGenre($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
        id
      }
      published
      id
      genres
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

export const ME = gql`
  query {
    me {
      username
      id
      favoriteGenre
    }
  }
`
