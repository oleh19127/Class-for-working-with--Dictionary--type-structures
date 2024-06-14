import { logger } from './logger.js';

class DictionaryMap {
  constructor(dictionary) {
    this.dictionary = dictionary;
  }

  async size() {
    let size = 0;
    for (const key in this.dictionary) {
      if (Object.hasOwnProperty.call(this.dictionary, key)) {
        size++;
      }
    }
    return size;
  }

  async empty() {
    return (await this.size()) === 0;
  }

  async equals(otherDictionary) {
    return JSON.stringify(this.dictionary) === JSON.stringify(otherDictionary);
  }

  async swap(otherDictionary) {
    const temp = { ...this.dictionary };
    this.dictionary = { ...otherDictionary };
    otherDictionary = { ...temp };
    return [this.dictionary, otherDictionary];
  }

  async include(key, value) {
    this.dictionary[key] = value;
    return this.dictionary;
  }

  async exclude(key) {
    delete this.dictionary[key];
    return this.dictionary;
  }

  async find(key) {
    return this.dictionary[key];
  }

  async for_each(callback) {
    const entries = Object.entries(this.dictionary);
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      this.dictionary[key] = await callback(key, value);
    }
  }
}

const main = async () => {
  const fruits = {
    apple: 'apple',
    banana: 'banana',
  };

  const person = {
    age: 24,
    height: 180,
    weight: 75,
    name: 'oleh',
  };

  const dictionaryMap = new DictionaryMap(fruits);

  // SIZE
  const dictionarySize = await dictionaryMap.size();
  logger.info(`Dictionary size: ${dictionarySize}`);

  // EMPTY
  const dictionaryEmpty = await dictionaryMap.empty();
  logger.info(`Dictionary empty: ${dictionaryEmpty}`);

  // EQUALS
  const dictionaryEquals = await dictionaryMap.equals(person);
  logger.info(`Dictionary equals: ${dictionaryEquals}`);

  // INCLUDE
  const dictionaryInclude = await dictionaryMap.include('cherry', 'cherry');
  logger.info(`Dictionary include: ${JSON.stringify(dictionaryInclude)}`);

  // EXCLUDE
  const dictionaryExclude = await dictionaryMap.exclude('apple');
  logger.info(`Dictionary after exclude: ${JSON.stringify(dictionaryExclude)}`);

  // FIND
  const foundValue = await dictionaryMap.find('banana');
  logger.info(`Found value for found: ${foundValue}`);

  // FOR_EACH - Convert all values to uppercase
  await dictionaryMap.for_each(async (key, value) => {
    return logger.info(value);
  });

  // SWAP
  const dictionarySwap = await dictionaryMap.swap(person);
  logger.info(`Dictionary swap: ${JSON.stringify(dictionarySwap)}`);
};

main();
