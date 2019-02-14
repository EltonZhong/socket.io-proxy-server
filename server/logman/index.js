module.exports = {
    logger: {
        info: function (){
            console.info(...arguments);
        },
        debug: function (){
            console.debug(...arguments);
        },
    }
}