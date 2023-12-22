export const validEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};


export const validPhoneNumber = (number) => {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}

export const isEmpty = (value) => {
    return (
        value === null || // kiểm tra null
        value === undefined || // kiểm tra undefined
        value === '' || // kiểm tra chuỗi rỗng
        (Array.isArray(value) && value.length === 0) || // kiểm tra mảng rỗng
        (typeof value === 'object' && Object.keys(value).length === 0) // kiểm tra đối tượng rỗng
    );
}
