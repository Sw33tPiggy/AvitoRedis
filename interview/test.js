// var employee1 = {
//   firstname: "John",
//   lastName: "Robinson",
// };

// var employee2 = {
//   firstname: "Barbara",
//   lastName: "Kek",
// };

// function invite(greeting1, greeting2) {
//   console.log(
//     greeting1 + " " + this.firstname + " " + this.lastName + ", " + greeting2
//   );
// }

// // invite.call(employee1, 'Hello', 'How are you?');
// // invite.call(employee2, 'Hello', 'How are you?');

// //Impure
// let numberArray = [];
// const impureAddNumber = (number) => numberArray.push(number);
// //Pure
// const pureAddNumber = (number) => {
//   return (argNumberArray) => {
//     return argNumberArray.concat([number]);
//   };
// };
// //Display the results
// console.log(impureAddNumber(6)); // returns 1
// console.log(numberArray); // returns [6]
// console.log(pureAddNumber(7)(numberArray)); // returns [6, 7]
// console.log(pureAddNumber(7).toString()); // returns [6, 7]
// console.log(numberArray); // returns [6]



function test(arg) {
    var a = 10;
    var b = 20;
    return (carg) => {
        var output = '' + a + ' ' + b + ' ' + arg + ' ' + carg;
        
        a = a + 1;
        console.log(a);
        b--;
        return output;
    }
}

var closure1 = test('Hello1');

console.log(closure1('There1'));
var closure2 = test('Hello2');
console.log(closure2('There2'));
