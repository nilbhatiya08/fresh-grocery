fetch('https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=Tomato')
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)));
