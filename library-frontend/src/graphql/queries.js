import { gql } from '@apollo/client'
import { BOOK_DETAILS, AUTHOR_DETAILS } from './fragments'

export const GET_BOOKS = gql`
  query getBooks($genre: String) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const GET_AUTHORS = gql`
  query {
    allAuthors {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
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
