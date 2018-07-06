import mongoose     from 'mongoose';
import Base         from 'service-layer/Base';
import { dumpPosts } from '../utils.js';

const Posts = mongoose.model('Posts');

export default class Create extends Base {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            username       : [ 'required', 'stringOrNumber' ],
            text        : [ 'required', { min_length : 200 } ]
        } } ]
    };

    async execute(data) {
        const post = await Posts.create(data.data);

        return {
            data : dumpPosts(post)
        };
    }
}
