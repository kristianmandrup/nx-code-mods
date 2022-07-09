import {
  GrammarObject,
  GrammarSubject,
  createSentenceMaker,
} from './../../auto-name';

const context = describe;

describe('sentence maker', () => {
  context('setAdmin', () => {
    const object: GrammarObject = {
      noun: 'users',
      action: 'filter',
    };
    const subject: GrammarSubject = {
      noun: 'type',
      preposition: 'by',
    };
    const sentenceMaker = createSentenceMaker({ object, subject });

    describe('orderedParts', () => {
      it('returns ordered parts', () => {
        const order = sentenceMaker.orderedParts;
        expect(order).toEqual(['filter', 'users', 'by', 'type']);
      });
    });

    describe('ensureValidParts', () => {
      it('returns valid parts', () => {
        const parts = sentenceMaker.ensureValidParts(
          sentenceMaker.orderedParts,
        );
        expect(parts).toEqual(['filter', 'users', 'by', 'type']);
      });
    });

    describe('parts', () => {
      it('set, admin, type', () => {
        const parts = sentenceMaker.parts;
        expect(parts).toEqual(['filter', 'users', 'by', 'type']);
      });
    });
  });
});
