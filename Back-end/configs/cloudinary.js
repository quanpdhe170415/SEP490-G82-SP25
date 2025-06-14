const cloudinary = require('cloudinary').v2;

// Configuration
cloudinary.config({ 
    cloud_name: 'dffpi0sbv', 
    api_key: '284526698536176', 
    api_secret: 'dQ29vrxta9EoBBK49hj508LyHvo' // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary