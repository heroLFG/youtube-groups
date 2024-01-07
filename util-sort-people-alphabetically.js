const fs = require('fs');

// Read the JSON file
fs.readFile('index.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    // Parse the JSON data
    let jsonData = JSON.parse(data);

    // Sort the people array alphabetically by name
    jsonData.people.sort((a, b) => a.name.localeCompare(b.name));

    // Convert the videos object to an array, sort it by date, and convert back to object
    let sortedVideos = Object.values(jsonData.videos)
                             .sort((a, b) => new Date(a.date) - new Date(b.date))
                             .reduce((obj, video) => {
                                 obj[video.id] = video;
                                 return obj;
                             }, {});

    // Update the jsonData with sorted videos
    jsonData.videos = sortedVideos;

    // Write the sorted JSON back to file or do something else with it
    fs.writeFile('index.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error("Error writing the file:", err);
        } else {
            console.log("Data successfully sorted and saved.");
        }
    });
});
