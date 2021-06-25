const jwt = require("jsonwebtoken");
const { tokenGenerator, voiceResponse } = require("../src/handler");

const when = describe;

describe("#tokenGenerator", () => {
  it("generates a new token", () => {
    const token = tokenGenerator();
    const decoded = jwt.decode(token.token, { complete: true });

    expect(decoded.payload).toHaveProperty("jti");
    expect(decoded.payload).toHaveProperty("grants");
    expect(decoded.payload.grants.identity).toBe(token.identity);
  });
});

describe("#voiceResponse", () => {
  when("receives an empty or no value value", () => {
    it("returns a goodbye message", () => {
      const twiml = voiceResponse();
      const count = countWord(twiml);

      // TwiML Verbs
      expect(count("Say")).toBe(2);

      // TwiML content
      expect(twiml).toContain("Thanks for calling!");
    });
  });

  when("receives a value as string", () => {
    it("returns a dial verb with the client attribute", () => {
      const toNumber = "BigBoss";
      const twiml = voiceResponse(toNumber);
      const count = countWord(twiml);

      // TwiML Verbs
      expect(count("Dial")).toBe(2);
      expect(count("Client")).toBe(2);

      // TwiML options
      expect(twiml).toContain(toNumber);
    });
  });

  when("receives a valid phone number", () => {
    it("returns a dial verb with the number attribute", () => {
      const toNumber = "+1235555555";
      const twiml = voiceResponse(toNumber);
      const count = countWord(twiml);

      // TwiML Verbs
      expect(count("Dial")).toBe(2);
      expect(count("Number")).toBe(2);

      // TwiML options
      expect(twiml).toContain(toNumber);
    });
  });
});

/**
 * Counts how many times a word is repeated
 * @param {String} paragraph
 * @return {String[]}
 */
function countWord(paragraph) {
  return (word) => {
    const regex = new RegExp(`\<${word}[ | \/?\>]|\<\/${word}?\>`);
    return paragraph.split(regex).length - 1;
  };
}
