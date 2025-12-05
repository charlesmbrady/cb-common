export const projects = [
  {
    id: '1',
    title: 'Mockdat',
    description:
      'An application used to create different forms of mock data records',
    thumbnail: 'https://charshard.s3.us-east-1.amazonaws.com/mockdat.png',
    tags: [
      'React',
      'Node.js',
      'Express',
      'DynamoDB',
      'AWS Cognito',
      'Material-UI',
    ],
    appLink: 'https://mockdat.charlesmbrady.com',
    featured: true,
  },
  {
    id: '2',
    title: 'DupeGen',
    description:
      'This is a duplicate generator that I built to test data quality tools on very large datasets (millions of records). It generates a .csv of just a few, or millions of controlled duplicate records that can then be inserted in to Salesforce with an ETL tool.',
    thumbnail: 'https://charlesmbrady.github.io/images/dupegen.png',
    tags: [
      // 'React', 'Firebase', 'Redux', 'Material-UI'
    ],
    demoLink: 'https://www.youtube.com/embed/PH5ANolA4dk',
    codeLink: 'https://github.com/charlesmbrady/DupeGen2',
    featured: false,
  },
  {
    id: '3',
    title: 'JamCam',
    description:
      'A suite of tools to help learn to play guitar and build tab/song ideas/',
    thumbnail: 'https://charshard.s3.us-east-1.amazonaws.com/jamcam-dash.png',
    tags: [
      'React',
      'Node.js',
      'Express',
      'DynamoDB',
      'AWS Cognito',
      'Material-UI',
    ],
    appLink: 'https://jamcam.charlava.com',
    featured: true,
  },
  {
    id: '4',
    title: 'KeyTrain',
    description:
      'An application to help learn hotkeys for both common and unique applications.',
    thumbnail: 'https://charshard.s3.us-east-1.amazonaws.com/keytrain.png',
    tags: [
      'React',
      'Node.js',
      'Express',
      'DynamoDB',
      'AWS Cognito',
      'Material-UI',
    ],
    appLink: 'https://keytrain.charlava.com',
    featured: true,
  },
  {
    id: '5',
    title: 'Scrape N Surf',
    description:
      'I built this app awhile ago when I was learning the JQuery library and web scraping. I love surfing, so I built this to scrape www.surfline.com for the latest surfing news articles, store their information in a MongoDB database, and add notes to them for later!',
    thumbnail: 'https://charlesmbrady.github.io/images/scrapensurf.png',
    tags: [
      // 'React',
      // 'Node.js',
      // 'Express',
      // 'MongoDB',
      // 'Chart.js',
      // 'Tailwind CSS',
    ],
    demoLink: 'https://www.youtube.com/embed/DqJ_aQXdQpg',
    codeLink: 'https://github.com/charlesmbrady/Mongo-News-Scraper',
    featured: false,
  },
  {
    id: '6',
    title: 'Google Books Search',
    description:
      'Search the GoogleBooks API for your favorite books using this stylish frontend built with React. Store them in a NoSQL MongoDB database for later or visit the GoogleBooks store to purchase them.',
    thumbnail: 'https://charlesmbrady.github.io/images/googleBooksSearch.png',
    tags: [
      // 'React',
      // 'Node.js',
      // 'Express',
      // 'MongoDB',
      // 'Chart.js',
      // 'Tailwind CSS',
    ],
    codeLink: 'https://github.com/charlesmbrady/GoogleBookSearch',
    demoLink: 'https://www.youtube.com/embed/CaAn4yNo-t8',
    featured: false,
  },
];
