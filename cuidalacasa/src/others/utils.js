const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const formatDate = (dateFrom, dateTo) => {
    return dateFrom.toString().substring(0, 16) + " - " + dateTo.toString().substring(0, 16);
};

function areAnyUndefined(list) {
    return list.filter( (element) => {
        return element === undefined
            || element.length === 0
    } ).length > 0;
}

function getChatId(emitterId, idReceptor) {
    if (emitterId < idReceptor)
        return `chat-${emitterId}-${idReceptor}`;
    else
        return `chat-${idReceptor}-${emitterId}`;
}

export {sleep, areAnyUndefined, formatDate, getChatId}
