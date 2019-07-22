import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const bookSchema = new Schema({
name: String,
published: Boolean,
authorId: String
});
export default mongoose.model('Book',bookSchema);
