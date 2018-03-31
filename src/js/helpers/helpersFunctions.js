export const randomRange = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;

export const randomFloatRange = (min, max) => Math.random() * (max - min) + min;

export const validationNumberField = (min, max, v) => {
    const val = v.toString().trim();
    let error = false;

    if (val && val.length !== 0) {
        const num = val.match(/\d+/g).map(Number);

        if (num < min) {
            error = `Min value ${min}`;

        } else if (num > max) {
            error = `Max value ${max}`;

        }
    } else {
        error = 'Required field';
    }

    return error;
};