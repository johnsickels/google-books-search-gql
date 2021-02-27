import gql from 'graphql-tag';

export const ADD_USER = gql`
  mutation createUser($username: String!, $password: String!, $email: String!) {
    createUser(username: $username, password: $password, email: $email) {
      user {
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        username
      }
      token
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      savedBooks {
        bookId
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        title
        description
        image
        authors
      }
    }
  }
`;
