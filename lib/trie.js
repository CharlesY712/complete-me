const Node = require('./node');

class Trie {
  constructor () {
    this.numberOfWords = 0;
    this.children = {};
  }

  insert(word) {
    this.addToTrie(this, word);
  }

  addToTrie (node, word) {
    const firstLetter = word[0];

    if (!node.children[firstLetter]) {
      node.children[firstLetter] = new Node();
    }
    if (word.length > 1) {
      this.addToTrie(node.children[firstLetter], word.slice(1));
    }
    if (word.length === 1 && node.children[firstLetter].completeWord !== 1) {
      this.numberOfWords++;
      node.children[firstLetter].completeWord = 1;
    }
  }

  Refactored insert as requested from eval

  addToTrie (node, word) {
    let letters = [...word];

    while (letters.length > 0) {
      let letter = letters.shift();

      if (!node.children[letter]) {
        node.children[letter] = new Node();
      }
      if (letters.length === 0 && node.children[letter].completeWord !== 1) {
        this.numberOfWords++;
        node.children[letter].completeWord = 1;
      }

      node = node.children[letter];
    }
  }

  suggest(prefix) {
    const suggestions = [];
    let currentNode = this.traverse(prefix);
    const addSuggestion = (node, prefix) => {
      if (node.completeWord) {
        if (node.populartiy > 0) {
          suggestions.unshift(prefix);
        } else {
          suggestions.push(prefix);
        }
      }

      const childNodes = Object.keys(node.children);

      childNodes.forEach((child) => {
        const newString = prefix + child;

        addSuggestion(node.children[child], newString);
      });

    };

    if (currentNode) {
      addSuggestion(currentNode, prefix);
    }

    return suggestions;
  }

  traverse(prefix) {
    let currentNode = this;
    let numberOfNodesTraversed = 0;
    let count = 0;

    while (count < prefix.length) {
      if (currentNode.children[prefix[count]]) {
        currentNode = currentNode.children[prefix[count]];
        numberOfNodesTraversed++;
      }
      count++;
    }

    if (numberOfNodesTraversed !== prefix.length) {
      return null;
    }

    return currentNode;
  }

  populate(array) {
    array.forEach( word => {
      this.insert(word);
    });
  }

  select(word) {
    let currentNode = this.traverse(word);

    if (currentNode) {
      currentNode.populartiy++;
    }
  }

  delete(word) {
    let currentNode = this.traverse(word);

    if (currentNode) {
      currentNode.completeWord = 0;
    }
  }
}

module.exports = Trie;