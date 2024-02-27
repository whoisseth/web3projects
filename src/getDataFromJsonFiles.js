const fs = require("fs");
const path = require("path");

function getDataFromJsonFiles(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  const dataArray = [];

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && path.extname(filePath) === ".json") {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      try {
        const jsonData = JSON.parse(fileContent);
        if (Array.isArray(jsonData)) {
          dataArray.push(...jsonData);
        } else {
          dataArray.push(jsonData);
        }
      } catch (error) {
        console.error(`Error parsing JSON file ${file}:`, error);
      }
    }
  });

  return dataArray;
}

module.exports = { getDataFromJsonFiles };
