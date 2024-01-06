// generate-static-pages.js

const fs = require('fs');

function parseIndex(people, channels) {
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
  })
}

function generateIndexJS(people, channels) {
  // Convert the object to a JSON string
  let peopleString = JSON.stringify(people);
  // Replace double quotes with single quotes
  peopleJsonString = peopleString.replace(/"([^"]+)":/g, '$1:');
  // Replace double quotes for array elements
  peopleJsonString = peopleJsonString.replace(/"\b/g, "'").replace(/\b"/g, "'");
  // Convert the object to a JSON string
  let channelsString = JSON.stringify(channels);
  // Replace double quotes with single quotes
  channelsJsonString = channelsString.replace(/"([^"]+)":/g, '$1:');
  // Replace double quotes for array elements
  channelsJsonString = channelsJsonString.replace(/"\b/g, "'").replace(/\b"/g, "'");


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
function generatePersonHTML(person) {
  return `
<!-- generated code -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>${person.name} - Profile</title>
  <!-- Include shared styles and scripts -->
</head>
<body>
  <header>
    <h1>${person.name}</h1>
    <p>${person.about}</p>
  </header>
  <main>
    <h2>Interests</h2>
    <ul>
      ${person.interests.map(interest => `<li>${interest}</li>`).join('')}
    </ul>
  </main>
  <!-- Footer and additional content -->
</body>
</html>`;
}

// Function to generate the HTML content for a channel
function generateChannelHTML(channel) {
  const owner = channel.owner;
  return `
<!-- generated code -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>${channel.handle}</title>
  <!-- Include shared styles and scripts -->
</head>
<body>
  <header>
    <h1>${channel.handle}</h1>
    <p>Owned by ${owner.name}</p>
  </header>
  <main>
    <h2>About the Channel</h2>
    <p>${channel.description}</p>
    <aside>
      <h3>Interests</h3>
      <ul>
        ${channel.interests.map(interest => `<li>${interest}</li>`).join('')}
      </ul>
    </aside>
  </main>
  <!-- Footer and additional content -->
</body>
</html>`;
}

// Function to generate all static files
function generateStaticFiles() {
  const people = [],
    channels = [];
  parseIndex(people, channels);

  // Generate index.js
  const filename = `index.js`;
  const content = generateIndexJS(people, channels);
  fs.writeFileSync(filename, content);
  console.log(`Genereated ${filename}`);

  // Generate HTML files for people
  people.forEach(person => {
    const filename = `people/${person.name.toLowerCase().split(' ').join('-')}.html`;
    const content = generatePersonHTML(person);
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