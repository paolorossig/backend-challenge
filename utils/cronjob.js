import axios from 'axios';
import cron from 'node-cron';

const marvelApiURL = process.env.MARVEL_API_URL;
const ts = process.env.API_TS;
const apikey = process.env.API_KEY;
const hash = process.env.API_HASH;
const apiURL = process.env.API_URL;

/**
 * It takes a page number as an argument, and returns an object with two properties: data and
 * totalPages. The data property is an array of character objects, and the totalPages property is the
 * total number of pages of data
 * @param page - The page number to query.
 * @returns An object with two properties: data and totalPages.
 */
const queryData = async (page) => {
  const limit = 100;
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    ts,
    apikey,
    hash,
  });

  const res = {
    data: [],
    totalPages: 0,
  };

  try {
    const response = await axios.get(`${marvelApiURL}/characters?${params}`);

    if (response.status === 200) {
      res.data.push(...response.data.data.results);
      res.totalPages = Math.ceil(response.data.data.total / limit);
    }
    return res;
  } catch (error) {
    console.log('Error in queryData:', error.message);
    return res;
  }
};

/**
 * It takes an array of objects and returns an array of objects with a subset of the original data
 * @param rowData - The data that is returned from the API.
 * @returns An array of objects with the following properties:
 * id, name, imageUrl, comicsAvailable, seriesAvailable, storiesAvailable, wikiUrl
 */
const transformToCharacter = (rowData) => {
  return rowData.map((character) => {
    const {
      id,
      name,
      thumbnail: { path, extension },
      comics: { available: comicsAvailable },
      series: { available: seriesAvailable },
      stories: { available: storiesAvailable },
      urls,
    } = character;

    return {
      id,
      name,
      imageUrl: `${path}/portrait_small.${extension}`,
      comicsAvailable,
      seriesAvailable,
      storiesAvailable,
      wikiUrl: urls.find((el) => el.type === 'wiki')?.url,
    };
  });
};

/**
 * It queries the data from the API, transforms it to the format we want, and then saves it to our
 * database
 * @param page - The page number to query.
 * @returns The total number of pages
 */
const getAndSaveData = async (page) => {
  try {
    const { data, totalPages } = await queryData(page);
    const characters = transformToCharacter(data);

    const response = await axios.post(`${apiURL}/characters`, { characters });
    if (response.status === 201) {
      console.log(response.data);
    }
    return totalPages;
  } catch (error) {
    console.log('Error in saveData:', error);
    return 0;
  }
};

/* A cron job that runs every 15 minutes. */
const cronjob = cron.schedule(
  '*/15 * * * *',
  async () => {
    let page = 1;
    let totalPages = 1;

    await axios.delete(`${apiURL}/characters`);

    do {
      console.log('-> Page:', page);
      console.log('Get data started at: ', new Date());
      totalPages = await getAndSaveData(page);
      page++;
    } while (page <= totalPages);
  },
  { scheduled: false }
);

export default cronjob;
