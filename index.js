// index.js

// people will be used for nav and search and static file generation into the people directory
const people = [
    {
        id: 1,
        name: 'Gavin Palmer', // creates people/gavin-palmer.html file
        interests: ['practicing loving people', 'technology'],
        about: 'Husband, Father, Engineer, and Christish'
    },
    // ... other people
];

// channels will be used for nav and search and static file generation into the channels directory
const channels = [
    {
        handle: '@RightInChrist', // creates channels/rightinchrist.html file
        description: 'I decided to practice making Jesus my king on October 12, 2023. My videos will attempt to point people towards a relationship with God through Jesus who will go after the lost sheep. My king goes after your worst enemy to give them the best gift which is to know God.',
        owner: 1,
        interests: ['practicing loving people', 'technology']
    },
    {
        handle: '@herolfg', // creates channels/herolfg.html file
        description: 'Seeking the ideal',
        owner: 1,
        interests: ['technology']
    },
    // ... other channels
];

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
