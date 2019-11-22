class QuickDebug {

    static log(message = log.caller) {
        return console.log('Debug:', Date.now(), " | ", message);
    }
}