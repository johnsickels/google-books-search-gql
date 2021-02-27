const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const foundUser = await User.findOne({
          _id: context.user._id,
        }).select('-password');
        return foundUser;
      }

      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    createUser: async (parent, body) => {
      // console.log(body);
      const user = await User.create(body);

      //   if (!user) return 'Something is wrong';

      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('That user does not exist');
      }

      if (!(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    // * `saveBook`: Accepts a book author's array, description, title, bookId, image, and link as parameters; returns a `User` type. (Look into creating what's known as an `input` type to handle all of these parameters!)
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const foundUser = await User.findOne({
          _id: context.user._id,
        }).select('-password');
        console.log(bookData)
        // save the book to the user
        foundUser.savedBooks = [...foundUser.savedBooks, bookData];

        await foundUser.save();
        return foundUser;
      }

      throw new AuthenticationError('Not logged in');
    },
    // `removeBook`: Accepts a book's `bookId` as a parameter; returns a `User` type.
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const foundUser = await User.findOne({
          _id: context.user._id,
        }).select('-password');

        // save the book to the user
        foundUser.savedBooks = foundUser.savedBooks.filter(
          (book) => book.bookId != bookId
        );

        await foundUser.save();
        return foundUser;
      }

      throw new AuthenticationError('Not logged in');
    },
  },
};

module.exports = resolvers;
