
import * as fs from 'fs';
import * as utils from 'util';

// Promisify some utility functions
export const exists = utils.promisify(fs.exists);
export const mkdir = utils.promisify(fs.mkdir);