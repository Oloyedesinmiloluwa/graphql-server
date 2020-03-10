import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLBoolean,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
	GraphQLNonNull,
} from 'graphql';
import mongoose from 'mongoose';
import Book from '../models/books';
import Author from '../models/authors';

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: {type: GraphQLString},
		name: {type: GraphQLString},
		published: {type: GraphQLBoolean},
		authorId: {type: GraphQLID},
		author: {
			type: AuthorType,
			resolve(parent, args){
				return Author.findById(parent.authorId);
			}
		}
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		age: {type: GraphQLInt},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent,args){
				return Book.find({authorId: parent.id});
			}
		}
	})
})

const book = [
	{id: '1', 'name': 'we', published: true, authorId: '1'},
	{id: '2', 'name': 'we', published: false, authorId: '2'},
	{id: '3', 'name': 'we 2', published: false, authorId: '2'},
];
const author = [
	{id: '1', name: 'author1', age: 1},
	{id: '2', name: 'author2', age: 2}
]
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		books: {
			type: new GraphQLList(BookType),
			resolve(parent,args){
				return Book.find();
			}
		},
		book: {
			type: BookType,
			args: { id: { type: GraphQLString }},
			resolve(parent, args){
				return Book.findById(args.id);
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(){
				return Author.find();
			}
		},
		author: {
			type: AuthorType,
			args: { id: {type: GraphQLID }},
			resolve(parent, args){
				return Author.findById(args.id);
			}
		}
	}
});
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parent, args){
				const newAuthor = new Author({
					name: args.name,
					age: args.age
				});
				return newAuthor.save();
			}
		},
		addBook: {
			type: BookType,
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)},
				authorId: {type: new GraphQLNonNull(GraphQLID)},
				published: {type: GraphQLBoolean}
			},
			resolve(parent, args){
				const newBook = new Book({
					name: args.name,
					authorId: args.authorId,
					published: args.published
				});
				return newBook.save();

			}
		}
	}
});
export const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
