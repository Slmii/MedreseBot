const { PREFIX } = require('../config.json');

const sortByProperty = (data, propertyName) => {
    return data.sort((a, b) => a[propertyName] > b[propertyName] ? 1 : -1);
};

const renderResults = ({ data, inline = false, prefix = false }) => {
    return data.map(item => `\`${prefix ? PREFIX : ''}${item.toLowerCase()}\``).join(inline ? ' ' : '\n');
};

const chunkByProperty = (data, propertyName) => {
    const maxLength       = 2048;
    let currentLength     = 0;
    let chunkedArrays     = [];
    let currentArrayIndex = 0;

    data.forEach(item => {
        if (!chunkedArrays[currentArrayIndex]) {
            chunkedArrays.push({
                data: []
            });
        }

        // +3 because we also need to take spaces and 2 backticks into consideration 
        currentLength += item[propertyName].length + 3;

        if (currentLength < maxLength) {
            chunkedArrays[currentArrayIndex].data.push(item);
            return;
        }
        
        currentArrayIndex++;
        currentLength = 0;
    });

    return chunkedArrays;
};

module.exports = {
    sortByProperty,
    renderResults,
    chunkByProperty
}