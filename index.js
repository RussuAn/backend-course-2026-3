const { Command } = require("commander");
const fs = require("fs");

const program = new Command();

program.configureOutput({
  outputError: (str, write) => {
    if (str.includes("required option") || str.includes("argument missing")) {
      write("Please, specify input file\n");
    } else {
      write(str);
    }
  }
});

program
  .requiredOption("-i, --input <path>", "шлях до вхідного файлу")
  .option("-o, --output <path>", "шлях до файлу для запису")
  .option("-d, --display", "вивести результат у консоль")
  .option("-c, --cylinders", "відображати кількість циліндрів")
  .option("-m, --mpg <value>", "фільтр за паливною економністю (нижче заданої)");

program.parse(process.argv);
const options = program.opts();

let rawData = "";
try {
  rawData = fs.readFileSync(options.input, "utf8");
} catch (err) {
  console.error("Cannot find input file");
  process.exit(1);
}

let cars = [];
try {
  cars = rawData.split("\n").filter(line => line.trim()).map(line => JSON.parse(line));
} catch (err) {
  console.error("Invalid JSON format");
  process.exit(1);
}

if (options.mpg) {
  const threshold = parseFloat(options.mpg);
  cars = cars.filter(car => car.mpg < threshold);
}

const resultLines = cars.map(car => {
  let line = car.model;
  
  if (options.cylinders) {
    line += ` ${car.cyl}`;
  }
  
  line += ` ${car.mpg}`;
  return line;
});

const resultData = resultLines.join("\n");

if (options.display) {
  if (resultData) console.log(resultData);
}

if (options.output && resultData) {
  fs.writeFileSync(options.output, resultData, "utf8");
}