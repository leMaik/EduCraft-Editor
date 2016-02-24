module.exports = (mongoose) => {
    const snippet = {
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: false
        },
        blockly: {
            type: String,
            required: false
        },
        lastModified: {
            type: Date
        }
    };

    const userSchema = mongoose.Schema({
        oauthId: {
            type: String,
            unique: true,
            required: true
        },
        username: {
            type: String,
            unique: true,
            required: true
        },
        snippets: [snippet]
    });

    return mongoose.model('User', userSchema);
};