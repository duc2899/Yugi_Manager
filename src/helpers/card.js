const buildParams = (pageNumber, filter) => {
    const params = {
        page: pageNumber,
        limit: 90,
    };
    
    Object.entries(filter).forEach(([key, value]) => {
        if (!value) return;

        // array → join
        if (Array.isArray(value) && value.length > 0) {
            params[key] = value.join(",");
        }

        // single value
        if (!Array.isArray(value)) {
            params[key] = value;
        }
    });

    return params;
};

const hasValue = (val) => {
    if (Array.isArray(val)) return val.length > 0;
    return val !== null && val !== undefined;
};

const resetFields = (filter, fields) => {
    const newFilter = { ...filter };

    fields.forEach((f) => {
        newFilter[f] = Array.isArray(filter[f]) ? [] : null;
    });

    return newFilter;
};

export { buildParams, hasValue, resetFields }