
// generated code

const people = [{id:1,name:'Gavin Palmer',interests:['practicing loving people','technology'],about:'Husband, Father, Engineer, and Christish',youtube_channels:[{handle:"@RightInChrist',description:'I decided to practice making Jesus my king on October 12, 2023. My videos will attempt to point people towards a relationship with God through Jesus who will go after the lost sheep. My king goes after your worst enemy to give them the best gift which is to know God.",interests:['practicing loving people','technology','play'],owner:{id:1,name:'Gavin Palmer'}},{handle:"@herolfg',description:'Seeking the ideal.",interests:['technology'],owner:{id:1,name:'Gavin Palmer'}}]}];
const channels = [{handle:"@RightInChrist',description:'I decided to practice making Jesus my king on October 12, 2023. My videos will attempt to point people towards a relationship with God through Jesus who will go after the lost sheep. My king goes after your worst enemy to give them the best gift which is to know God.",interests:['practicing loving people','technology','play'],owner:{id:1,name:'Gavin Palmer'}},{handle:"@herolfg',description:'Seeking the ideal.",interests:['technology'],owner:{id:1,name:'Gavin Palmer'}}];

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

