const given = require('../../steps/given');
const when = require('../../steps/when');
const then = require('../../steps/then');
const chance = require('chance').Chance();
const path = require('path');

describe('Tweet.profile.request template', () => {
    it("Should not short-circut if selectionSetList has more an 'id'", () => {
        const templatePath = path.resolve(__dirname, '../../../lib/AppsyncAPI/resolvers/mapping-templates/Tweet.profile.request.vtl');
        const username = chance.guid();
        const info = {
            selectionSetList: ['id', 'bio'],
        };
        const context = given.an_appsync_context({ username }, {}, {}, { creator: username }, info);
        const result = when.we_invoke_an_appsync_template(templatePath, context);

        expect(result).toEqual({
            version: '2018-05-29',
            operation: 'GetItem',
            key: {
                id: {
                    S: username,
                },
            },
        });
    });


    it("Should short-circut if selectionSetList has only 'id'", () => {
        const templatePath = path.resolve(__dirname, '../../../lib/AppsyncAPI/resolvers/mapping-templates/Tweet.profile.request.vtl');
        const username = chance.guid();
        const info = {
            selectionSetList: ['id'],
        };
        const context = given.an_appsync_context({ username }, {}, {}, { creator: username }, info);
        const result = when.we_invoke_an_appsync_template(templatePath, context);

        expect(result).toEqual({
            id: username,
            __typename: 'MyProfile'
        });
    });
});

module.exports = {};
