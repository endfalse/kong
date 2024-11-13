import {kConfig} from 'kongj'

test("get the prefix url of api", () => {
    console.log(kConfig.api.baseUrl)
    expect(kConfig.api.baseUrl).toBeDefined()
});