import { gql } from '@apollo/client'

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
      id
    }
    published
    id
    genres
  }
`

export const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    id
    born
    bookCount
  }
`
