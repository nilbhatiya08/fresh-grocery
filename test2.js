fetch('https://loremflickr.com/json/800/800/tomato,food')
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)));
