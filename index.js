import express from 'express';
import graphqlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import {schema} from './schema/schema';

const app = express();
mongoose.connect('mongodb://test:password@localhost/test');
mongoose.connection.once('open', () => {
	console.log("Connected to Database");
});
app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true
}));
app.listen(4000, () => console.info('server running at port, 4000'));
