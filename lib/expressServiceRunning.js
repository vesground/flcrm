import logger from 'bunyan-singletone-facade';
import expressServiceRunningTools from './expressServiceRunningTools';
import services from './services';

const tools = expressServiceRunningTools(services, { logger: (type, data) => logger[type](data) });

export const makeServiceRunner = tools.makeServiceRunner;
export const runService = tools.runService;
export const renderPromiseAsJson = tools.renderPromiseAsJson;
