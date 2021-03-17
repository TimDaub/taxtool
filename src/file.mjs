// @format
import csv from "ya-csv";

export async function toList(filePath) {
  return new Promise(resolve => {
    const list = [];

    const reader = csv.createCsvFileReader(filePath, {
      columnsFromHeader: true
    });

    reader.addListener("data", obj => {
      list.push(obj);
    });

    reader.addListener("end", () => {
      resolve(list);
    });
  });
}
