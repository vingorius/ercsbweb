var options = {
    // Basic usage
    host: 'localhost', // Default, optional
    port: 27017, // Default, optional
    db: 'ercsb-session', // Required

    // Basic authentication (optional)
    //username: 'user12345',
    //password: 'foobar',

    // Advanced options (optional)
    autoReconnect: true, // Default
    w: 1, // Default,
    ssl: false // Default
};
module.exports = options;
