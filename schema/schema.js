import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLBoolean,
	GraphQLID,
	GraphQLList,
	GraphQLInt
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
		author: {
			type: AuthorType,
			resolve(parent, args){
				return author.find(elem => parent.id === elem.id);
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
				return book.filter(elem => elem.authorId == parent.id);
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
				return book;
			}
		},
		book: {
			type: BookType,
			args: { id: { type: GraphQLString }},
			resolve(parent, args){
				return book.find(elem => elem.id === args.id);
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(){
				return author;
			}
		},
		author: {
			type: AuthorType,
			args: { id: {type: GraphQLID }},
			resolve(parent, args){
				return author.find(elem => elem.id === args.id);
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
				id: {type: GraphQLString},
				name: {type: GraphQLString},
				age: {type: GraphQLInt}
			},
			resolve(parent, args){
				// console.log(args);
				author.push({...args});
				const newAuthor = new Author({
					name: args.name,
					age: args.age
				});
				console.log(newAuthor);
				return newAuthor.save();
				return author[author.length -1];
			}
		}
	}
});
export const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
