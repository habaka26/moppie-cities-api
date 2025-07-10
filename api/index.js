const fetch = require('node-fetch');

let cache = null;
let lastFetch = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 минут

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TTL) {
    return res.status(200).json(cache);
  }

  try {
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbzOdPOS3m7BFoFbwOgm2N2svdp9BmEHAmZulJU4XFzmtrX6luHGoa631DHzeMjz5-87/exec';
    const response = await fetch(googleScriptUrl);
    const data = await response.json();

    cache = data;
    lastFetch = now;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from Google Sheets', details: err.toString() });
  }
};
