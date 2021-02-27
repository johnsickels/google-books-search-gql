import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries.js';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const { data, loading } = useQuery(GET_ME);
  const userData = data?.me;
  console.log(userData);

  const [
    deleteBook,
    { error: removeBookError, data: removeBookData, status },
  ] = useMutation(REMOVE_BOOK, {
    onCompleted: (data) => {
      console.log(data.saveBook.savedBooks);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData?.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData?.savedBooks?.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() =>
                      deleteBook({ variables: { bookId: book.bookId } })
                    }
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
