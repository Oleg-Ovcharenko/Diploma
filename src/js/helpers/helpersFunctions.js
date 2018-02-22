export const randomRange = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;

export const validationNumberField = (min, max, val) => {
    let err = false;

    if (val < min) {
        err = `Value can not be less than ${min}`;
    } else if (val > max) {
        err = `Value can not be greater than ${max}`;
    }

    return err;
};
