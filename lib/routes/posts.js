import { makeServiceRunner }  from '../expressServiceRunning';

export default {
    create : makeServiceRunner('posts/Create', req => req.body),
    list   : makeServiceRunner('posts/List',   req => req.query)
};
