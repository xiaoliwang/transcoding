const access = {
    accessKeyId: "",
    accessKeySecret: "",
}

const configs = {
    oss: {
        region: "",
        internal: false,
        secure: false,
        bucket: "",
        timeout: 18000,
    }
};

for (let name in configs) {
    configs[name] = Object.assign({}, configs[name], access);
}

module.exports = configs;