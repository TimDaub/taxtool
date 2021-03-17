//@format
import { readFileSync } from "fs";
import process from "process";

import { readLines } from "./file.mjs";

const { FILE } = process.env;

const lines = readLines(FILE);
