import mongoose     from 'mongoose';
import Base         from 'service-layer/Base';
import { dumpPosts } from '../utils.js';

const Posts = mongoose.model('Posts');

export default class List extends Base {
    static validationRules = {};

    async execute() {
        const [ posts, , totalCount ] = await Promise.all([
            Posts.find(),
            Posts.count()
        ]);

        const data = posts.map(dumpPosts);

        return {
            data,
            meta : {
                totalCount
            }
        };
    }
}
