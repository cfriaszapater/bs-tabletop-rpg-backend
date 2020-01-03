const { throwRunes } = require("./runes");
const random = require("../util/random");
jest.mock("../util/random");

describe("Runes", () => {
  it("should throw runes", () => {
    random.getRandomInt.mockReturnValueOnce(0);
    random.getRandomInt.mockReturnValueOnce(1);
    random.getRandomInt.mockReturnValueOnce(1);

    expect(throwRunes(3)).toBe(2);
  });
});
