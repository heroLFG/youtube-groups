// generate-static-pages.js

const fs = require('fs');

// Data from index.js would be imported or duplicated here
const people = [
    /* ... */
];

const channels = [
    /* ... */
];

// Function to generate the HTML content for a person
function generatePersonHTML(person) {
    return `<!DOCTYPE html>
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
    const owner = people.find(p => p.id === channel.owner); // Find the owner by ID
    return `<!DOCTYPE html>
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