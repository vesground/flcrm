import mongoose  from 'mongoose';
import bluebird  from 'bluebird';
import Exception from 'service-layer/Exception';
import config    from '../etc/config.json';

import './models/Posts';

const { host, port, name } = config.db;

mongoose.Promise = bluebird;
export const mongotUrl = `mongodb://${host}:${port}/${(name)}`;

mongoose.connect(mongotUrl, { useMongoClient: true });

mongoose.Model.findById = async function findById(id) {
    const exception = new Exception({
        code   : 'WRONG_ID',
        fields : { id: 'WRONG_ID' }
    });

    /* istanbul ignore next */
    if (!id) throw exception;

    const doc = await this.findOne({ _id: id });

    if (!doc) throw exception;

    return doc;
};

export default mongoose;
