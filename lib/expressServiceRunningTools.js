/* eslint max-params:0 */

import util      from 'util';
import Exception from 'service-layer/Exception';
import pointer   from 'json-pointer';

export default function (
    services,
    {
        defaultParamsBuilder = () => ({}),
        defaultContextBuilder = req => cloneDeep(req.session && req.session.context ? req.session.context : {}),
        logger = defaultLogger
    } = {}
) {
    async function runService(actionName, { context = {}, params = {} }) {
        const actionPointer = actionName.startsWith('/') ? actionName : `/${actionName}`;
        const actionClass   = pointer.get(services, actionPointer);
        const startTime     = Date.now();

        try {
            const result = await new actionClass({
                context
            }).run(params);

            logRequest({
                logger,
                type   : 'info',
                actionName,
                params : util.inspect(params, { showHidden: false, depth: null }),
                result : JSON.stringify(result),
                startTime
            });

            return result;
        } catch (error) {
            logRequest({
                logger,
                type   : error instanceof Exception ? 'info' : 'error',
                actionName,
                params,
                result : error,
                startTime
            });

            throw error;
        }
    }

    function makeServiceRunner(
        actionName,
        paramsBuilder = defaultParamsBuilder,
        contexBuilder = defaultContextBuilder
    ) {
        return async function serviceRunner(req, res) {
            const resultPromise = runService(actionName, {
                params  : paramsBuilder(req, res),
                context : contexBuilder(req, res)
            });

            return renderPromiseAsJson(req, res, resultPromise);
        };
    }

    async function renderPromiseAsJson(req, res, promise) {
        try {
            const data = await promise;

            data.status = 1;

            return res.send(data);
        } catch (error) {
            /* istanbul ignore next */
            if (error instanceof Exception) {
                res.send({
                    status : 0,
                    error  : error.toHash()
                });
            } else {
                logger(
                    'error',
                    {
                        'REQUEST_URL'    : req.url,
                        'REQUEST_PARAMS' : req.params,
                        'REQUEST_BODY'   : req.body,
                        'ERROR_STACK'    : error.stack
                    }
                );

                res.send({
                    status : 0,
                    error  : {
                        code    : 'SERVER_ERROR',
                        message : 'Please, contact your system administartor!'
                    }
                });
            }
        }
    }

    return {
        makeServiceRunner,
        runService,
        renderPromiseAsJson
    };
}

/* istanbul ignore next */
function cloneDeep(data) {
    return JSON.parse(JSON.stringify(data));
}

function logRequest({ logger, type, actionName, params, result, startTime, userId }) {
    logger(type, {
        service : actionName,
        runtime : Date.now() - startTime,
        params,
        result,
        userId
    });
}

/* istanbul ignore next */
function defaultLogger(type, data) {
    const logMethodName = {
        error : 'error',
        info  : 'info'
    }[type && type.toLowerCase()] || 'debug';

    console[logMethodName](data);
}
