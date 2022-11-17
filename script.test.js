const battleship = require('./script')


test('sunkStatus is true when counter equals length', () => {
    expect(battleship.getCounter()).toBe(1)
});

