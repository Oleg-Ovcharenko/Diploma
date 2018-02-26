export const randomRange = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;

export const randomFloatRange = (min, max) => Math.random() * (max - min) + min;

export const validationNumberField = (min, max, val) => {
    let errorMessage = null;
    let hasError = false;

    if (val && val.length !== 0) {
        if (val < min) {
            errorMessage = `Value can not be less than ${min}`;
            hasError = true;
        } else if (val > max) {
            errorMessage = `Value can not be greater than ${max}`;
            hasError = true;
        }
    } else {
        errorMessage = '';
        hasError = true;
    }

    return {
        errorMessage,
        hasError,
    };
};
