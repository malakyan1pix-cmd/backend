function validateProduct ({name, price, stock}) {
    if (!name || !price) {
        return 'Name and price are required';
    }

    if (!Number.isFinite(price) || price <= 0) {
        return 'Price must be a positive number';
    }

    if (!Number.isInteger(stock) || stock < 0) {
        return 'Stock must be a non-negative integer';
    }
    return null;
}

module.exports = validateProduct;