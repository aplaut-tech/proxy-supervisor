const expect = require('chai').expect;
const Balancer = require('../../../lib/core/balancer');

describe('Core Balancer', () => {
  describe('.add', () => {
    it('should create new proxy with http://admin:123@127.0.0.1:3333/', () => {
      const balancer = new Balancer().add(['http://admin:123@127.0.0.1:3333/']);
      expect(balancer.proxies.get('127.0.0.1')).to.exist;
    });
    it('should create new proxy with http://127.0.0.1:3333/', () => {
      const balancer = new Balancer().add(['http://127.0.0.1:3333/']);
      expect(balancer.proxies.get('127.0.0.1')).to.exist;
    });
    it('should create new proxy with http://127.0.0.1:3333', () => {
      const balancer = new Balancer().add(['http://127.0.0.1:3333']);
      expect(balancer.proxies.get('127.0.0.1')).to.exist;
    });
    it('should create new proxy with http://127.0.0.1', () => {
      const balancer = new Balancer().add(['http://127.0.0.1']);
      const proxy = balancer.proxies.get('127.0.0.1');

      expect(proxy).to.exist;
      expect(proxy.url.protocol).to.be.eql('http:');
    });
    it('should create new proxy with 127.0.0.1', () => {
      const balancer = new Balancer().add(['127.0.0.1']);
      const proxy = balancer.proxies.get('127.0.0.1');

      expect(proxy).to.exist;
      expect(proxy.url.protocol).to.be.eql('http:');
    });
    it('should create new proxy with `google`', () => {
      const balancer = new Balancer().add(['google']);
      const proxy = balancer.proxies.get('google');

      expect(proxy).to.exist;
      expect(proxy.url.protocol).to.be.eql('http:');
    });
    it('should update node address', () => {
      const balancer = new Balancer().add(['127.0.0.1:3333']);

      const proxy1 = balancer.proxies.get('127.0.0.1');
      expect(proxy1.url.port).to.be.eql('3333');

      balancer.add(['http://127.0.0.1:3334']);
      const proxy2 = balancer.proxies.get('127.0.0.1');

      expect(proxy1).to.be.equal(proxy2);
      expect(proxy2.url.port).to.be.eql('3334');
    });
  });

  describe('.remove', () => {
    it('should delete proxy', () => {
      const balancer = new Balancer()
        .add(['127.0.0.1:3333'])
        .remove(['127.0.0.1']);

      expect(balancer.proxies.values()).to.be.empty;
    });

    it('should not throw when proxy not found', () => {
      const balancer = new Balancer()
        .remove(['127.0.0.1']);

      expect(balancer.proxies.values()).to.be.empty;
    });
  });

  describe('.proxy', () => {
    it('should return function', () => {
      const fn = new Balancer().proxy();
      expect(typeof fn).to.be.eql('function');
    });
  });
});