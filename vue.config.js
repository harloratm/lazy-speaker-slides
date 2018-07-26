module.exports = {
    baseUrl: process.env.NODE_ENV === 'production'
        ? '/lazy-speaker-slides/'
        : '/',
    productionSourceMap: false,
}
