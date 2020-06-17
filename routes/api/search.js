const fetch = require("isomorphic-fetch");
require("dotenv").config();

async function searchNasdaq(query) {
  console.log(query);
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ&apikey=28cbf7a3e170c33fbb032df9b9e13434`
  );
  let data = await response.json();
  return data;
}

const optimizedSearch = async (query) => {
  const data = await searchNasdaq(query);
  let j = 0;
  let triplets = [];
  triplets.push([]);
  for (let i = 1; i <= data.length; i++) {
    triplets[j].push(data[i - 1].symbol);

    if (i % 3 == 0) {
      triplets.push([]);
      j++;
    }
  }
  const tripletStrings = triplets.map((triple) => {
    return triple.join();
  });

  try {
    let profileData = await Promise.all(
      tripletStrings.map((item) =>
        fetch(
          `https://financialmodelingprep.com/api/v3/profile/${item}?apikey=28cbf7a3e170c33fbb032df9b9e13434`
        )
          .then((r) => r.json())
          .catch((error) => ({ error, url }))
      )
    );
    console.log(profileData);
    /*account for differences in API index names*/
    let allTogether = [];
      console.log(profileData);
      for (let i = 0; i < profileData.length; i++) {
        /*mult. req at once vs. single req*/
        if (i < profileData.length - 1) {
          allTogether.push(profileData[i]);
        } else {
          allTogether.push(profileData[i]);
        }
      }
      let merged = [].concat.apply([], allTogether);
      console.log(merged);
      return merged;
    } catch (err) {
      console.log(err);
    }
};

module.exports = optimizedSearch;
