module.exports = {
    localDate(v) {
        const d = new Date(v || Date.now());
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString();
    },
}