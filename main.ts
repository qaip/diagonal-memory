import { DiagonalMemory } from './memory.ts';
import { print } from './pretty.ts';

const memory = new DiagonalMemory();

print(memory.normalize());
memory.findNearest('1000000010000001', { verbose: true }).print();

print(memory.values);
memory.findByMask('111').print()
print(memory.values);

console.log(memory.getWord(1))
console.log(memory.getColumn(1))

// console.log('Mask matches:');
// memory.findByMask('x0xxx100').print();

// console.log('Nearest:');
// const nearest = memory.findNearest('00000110', { verbose: true });

// console.log('Max nearest:');
// nearest.print();
