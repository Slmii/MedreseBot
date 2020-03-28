const { PREFIX } = require('../config.json');
const { books }  = require('../data/books');

const renderOrderBooksFields = () => {
    return books.map(book => {
        return {
            name: book.title,
            value: `\`${PREFIX}bestellen ${book.keyword}\``
        };
    });
};

const renderReadBooksFields = () => {
    return books.map(book => {
        return {
            name: `${book.icon} ${book.title}`,
            value: book.pdf
        };
    });
};

const getBook = command => {
    return books.find(book => book.keyword === command.toLowerCase());
};

module.exports = {
    renderOrderBooksFields,
    renderReadBooksFields,
    getBook
};