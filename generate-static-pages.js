// generate-static-pages.js

const fs = require('fs');

function parseIndex() {
  const people = [];
  const channels = [];
  const jsonData = fs.readFileSync('index.json', 'utf8');
  const obj = JSON.parse(jsonData);
  obj.people.forEach(person => {
    people.push(person);
    person.youtube_channels.forEach(channel => {
      channel.owner = {
        id: person.id,
        name: person.name
      };
      channels.push(channel);
    })
  });
  return {
    people,
    channels,
    videos: obj.videos
  };
}

function generateIndexJS(people, channels) {
  let peopleJsonString = JSON.stringify(people);
  let channelsJsonString = JSON.stringify(channels);

  return `
// generated code

const people = ${peopleJsonString};
const channels = ${channelsJsonString};

function searchPeopleByInterests(interest) {
  if (interest === '') {
      return people;
  }
  return people.filter(person => person.interests.includes(interest));
}

function searchChannelsByInterests(interest) {
  if (interest === '') {
      return channels;
  }
  return channels.filter(channel => channel.interests.includes(interest));
}

// Expose the search functions to be used by other files
window.searchPeopleByInterests = searchPeopleByInterests;
window.searchChannelsByInterests = searchChannelsByInterests;

`;
}

// Function to generate the HTML content for a person
function generatePersonHTML(person, videos) {
  let youtube_channels = '';
  if (person.youtube_channels) {
    youtube_channels = `
    <h3>YouTube Channels</h3>
    <ul>
      ${person.youtube_channels.map(channel => `<li><a href="../channels/${channel.handle.substring(1).toLowerCase()}.html">${channel.handle}</a></li>`).join('')}
    </ul>
    `;
  }
  let interests = '';
  if (person.interests) {
    interests = `
    <h3>Interests</h3>
    <ul>
      ${person.interests.map(interest => `<li>${interest}</li>`).join('')}
    </ul>
    `;
  }
  let youtube_attention_giving = '';
  if (person.youtube_attention_giving) {
    youtube_attention_giving = `
    <h3>YouTube Attention Giving Self Report</h3>
    <ul>
      ${person.youtube_attention_giving.map(yt => `<li><a href="../channels/${yt.substring(1).toLowerCase()}.html">${yt}</a></li>`).join('')}
    </ul>
    `;
  }
  let youtube_interaction_videos = '';
  if (person.youtube_interaction_videos) {
    youtube_interaction_videos = `
    <h3>YouTube Interaction Videos</h3>
    <ul>
      ${person.youtube_interaction_videos.map(yt => `<li>${videos[yt].date} <a href="${videos[yt].link}">${videos[yt].title}</a></li>`).join('')}
    </ul>
    `;
  }

  return `
<!-- generated code -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${person.name} - Profile</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <div class="navigation-back">
    <a href="index.html">← Back to People</a>
  </div>
  <header>
    <h1>${person.name}</h1>
  </header>
  <div class="">
    <h2>About</h2>
    <p>${person.about}</p>
  </div>
  <main>${youtube_channels}${interests}${youtube_attention_giving}${youtube_interaction_videos}</main>
  <!-- Footer and additional content -->
  <footer class="footer"></footer>
</body>
</html>`;
}

// Function to generate the HTML content for a channel
function generateChannelHTML(channel) {
  let interests = '';
  if (channel.interests) {
    interests = `
    <h3>Interests</h3>
    <ul>
      ${channel.interests.map(interest => `<li>${interest}</li>`).join('')}
    </ul>
`;
  }
  const owner = channel.owner;
  return `
<!-- generated code -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${channel.handle}</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <div class="navigation-back">
    <a href="index.html">← Back to Channels</a>
  </div>
  <header>
    <h1>${channel.handle}</h1>
    <p>Owned by <a href="../people/${channel.owner.name.toLowerCase().split(' ').join('-')}.html">${owner.name}</a></p>
  </header>
  <main>
    <h2>About the Channel</h2>
    <p>${channel.description}</p>
    <aside>${interests}</aside>
  </main>
  <!-- Footer and additional content -->
  <footer class="footer"></footer>
</body>
</html>`;
}

// Function to generate all static files
function generateStaticFiles() {
  const {
    people,
    channels,
    videos
  } = parseIndex();

  // Generate index.js
  const filename = `index.js`;
  const content = generateIndexJS(people, channels);
  fs.writeFileSync(filename, content);
  console.log(`Genereated ${filename}`);

  // Generate HTML files for people
  people.forEach(person => {
    const filename = `people/${person.name.toLowerCase().split(' ').join('-')}.html`;
    const content = generatePersonHTML(person, videos);
    fs.writeFileSync(filename, content);
    console.log(`Generated file for ${person.name}`);
  });

  // Generate HTML files for channels
  channels.forEach(channel => {
    const handle = channel.handle.substring(1).toLowerCase(); // Remove '@' and convert to lowercase
    const filename = `channels/${handle}.html`;
    const content = generateChannelHTML(channel);
    fs.writeFileSync(filename, content);
    console.log(`Generated file for ${channel.handle}`);
  });
}

// Create directories if they don't exist
if (!fs.existsSync('people')) {
  fs.mkdirSync('people');
}

if (!fs.existsSync('channels')) {
  fs.mkdirSync('channels');
}

generateStaticFiles();