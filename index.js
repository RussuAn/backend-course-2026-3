const { Command } = require("commander");
const fs = require("fs");

const program = new Command();

program.configureOutput({
  outputError: (str, write) => {
    if (str.includes("required option")) {
      write("Please, specify input file\n");
    } else {
      write(str);
    }
  }
});

program
  .requiredOption("-i, --input <path>", "шлях до вхідного файлу")
  .option("-o, --output <path>", "шлях до файлу для запису")
  .option("-d, --display", "вивести результат у консоль");

program.parse(process.argv);
const options = program.opts();

let resultData = ""; 
try {
  const rawData = fs.readFileSync(options.input, "utf8");
  resultData = rawData; 
} catch (err) {
  console.error("Cannot find input file");
  process.exit(1);
}

if (options.display) {
  console.log(resultData);
}

if (options.output) {
  fs.writeFileSync(options.output, resultData, "utf8");
}