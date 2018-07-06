import LIVR         from 'livr';
import uuidValidate from 'uuid-validate';

const defaultRules = {
    'object_id'() {
        return value => {
            if (uuidValidate(value, 4)) return;

            if (value === undefined || value === null || value === '') return;
            if (typeof value !== 'string') return 'FORMAT_ERROR';
            if (value.length < 24) return 'WRONG_ID';
            if (value.length > 24) return 'WRONG_ID';
            if (value.match(/[^a-f0-9]/)) return 'WRONG_ID';
        };
    },

    'stringOrNumber'() {
        return value => {
            const rule = new RegExp('^[a-zA-Z0-9]*$', 'g');
            if (!value.match(rule)) return 'USERNAME_WRONG_TYPE';

            return;
        };
    }
};

LIVR.Validator.registerDefaultRules(defaultRules);
