import mongoose   from 'mongoose';
import timestamps from 'mongoose-timestamp';

const Schema = mongoose.Schema;

const PostsSchema = new Schema({
    username : { type: String, required: true },
    text     : { type: String, required: true }
});

PostsSchema.plugin(timestamps);

mongoose.model('Posts', PostsSchema);
