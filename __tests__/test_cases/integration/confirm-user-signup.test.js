const given = require('../../steps/given')
const when = require('../../steps/when')
const then = require('../../steps/then')
const chance = require('chance').Chance()

describe('When confirm user signup runs', () => {
    it("The users profile should be saved in dynamodb", async () => {
        const { name, email, password } = given.a_random_user();
        const username = chance.guid()

        const user = await when.we_invoke_ConfirmUserSignup(username, name, email)

        const ddbUser = await then.user_exists_in_UsersTable(username)
        expect(ddbUser).toMatchObject({
            id: username,
            name,
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g),
            followersCount: 0,
            followingCount: 0,
            tweetsCreated: 0,
            likesCount: 0
        })

        const [firstName, lastName] = name.split(' ')
        expect(ddbUser.screenName).toContain(firstName)
        expect(ddbUser.screenName).toContain(lastName)
    })
})