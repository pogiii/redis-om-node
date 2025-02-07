import { mocked } from 'ts-jest/utils';

import RedisShim from '../../../lib/redis/redis-shim';
import Client from '../../../lib/client';

jest.mock('../../../lib/redis/redis-shim');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#unlink", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.unlink('foo');
        expect(RedisShim.prototype.unlink).toHaveBeenCalledWith('foo');
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
      expect(async () => await client.unlink('foo'))
        .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.unlink('foo'))
        .rejects.toThrow("Redis connection needs opened."));
  });
});
