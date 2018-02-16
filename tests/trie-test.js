import { expect } from 'chai';
import Trie from '../lib/trie';
import fs from 'fs';

const text = "/usr/share/dict/words";
const dictionary = fs.readFileSync(text).toString().trim().split('\n');

describe('Trie', () => {
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it('should instantiate a new Trie as trie', () => {
    expect(trie).to.exist;
  });

  it('should track the number of words', () => {
    expect(trie.numberOfWords).to.equal(0);
  });

  it('should store nodes', () => {
    expect(trie.children).to.deep.equal({});
  });

  describe('Insert', () => {
    it('should create keys in children object of first letter', () => {
      trie.insert('cat');
      trie.insert('cat');
      trie.insert('cats');

      expect(trie.children['c'].completeWord).to.equal(0);
      expect(trie.children['c'].children['a'].completeWord).to.equal(0);
      expect(trie.children['c'].children['a'].children['t'].completeWord).to.equal(1);
      expect(trie.children['c'].children['a'].children['t'].children['s'].completeWord).to.equal(1);
    });
 
    it('should increment the number of words', () => {
      expect(trie.numberOfWords).to.equal(0);

      trie.insert('pizza');

      expect(trie.numberOfWords).to.equal(1);

      trie.insert('pizza');

      expect(trie.numberOfWords).to.equal(1);
    });
  });

  describe('Suggest', () => {
    it('should return an array of suggested words', () => {
      trie.insert('pize');
      trie.insert('pizza');
      trie.insert('pizzeria');
      trie.insert('pizzicato');
      trie.insert('pizzle');

      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);

      expect(trie.suggest('e')).to.deep.equal([]);
    });
  });

  describe('Populate', () => {
    it('should populate a dictionary of words', () => {
      expect(trie.numberOfWords).to.equal(0);

      trie.populate(dictionary);

      expect(trie.numberOfWords).to.equal(235886);     
    });

    it('should suggest words from the dictionary', () => {
      trie.populate(dictionary);

      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);
    });
  });

  describe('Select', () => {
    it('should prioritize selected words by incrementing the populartiy counter', () => {
      trie.populate(dictionary);

      expect(trie.traverse('pizzeria').populartiy).to.equal(0);
      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);

      trie.select("pizzeria");

      expect(trie.traverse('pizzeria').populartiy).to.equal(1);
      expect(trie.suggest("piz")).to.deep.equal(["pizzeria", "pize", "pizza", "pizzicato", "pizzle", ]);
    });
  });

  describe('Delete', () => {
    it('should prevent words from being suggested', () => {
      trie.populate(dictionary);

      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);

      trie.delete("pizzeria");

      expect(trie.suggest("piz")).to.deep.equal(["pize", "pizza", "pizzicato", "pizzle", ]);
    });
  });
});
