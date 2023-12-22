export const validEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const convertPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith('0')) {
        return '+84' + phoneNumber.substr(1);
    }
    return phoneNumber;
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

export const  checkFutureDateTime = (dateString, timeString) => {
    // Tạo một đối tượng Date từ chuỗi ngày và giờ
    const dateTimeString = dateString + ' ' + timeString;
    const dateTime = new Date(dateTimeString);

    // Lấy thời gian hiện tại
    const currentDateTime = new Date();

    // So sánh thời gian
    return dateTime > currentDateTime;
}
