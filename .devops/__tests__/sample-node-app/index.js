/**
 * The following code has the only purpose to test we can intall dependency and execute a node application
 */

const stringz = require('stringz'); 
const pkg = require('./package.json');

if(typeof stringz === "object") {
    console.log(`${pkg.name} is fine!`);
    process.exit(0);
} else {
    console.error(`${pkg.name} is not fine!`);
    process.exit(1);
}
