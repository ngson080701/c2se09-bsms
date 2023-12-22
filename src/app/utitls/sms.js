import dotenv from 'dotenv';
import axios from "axios";
dotenv.config();

export const sendSMS = async (sentTo,  bodyMessage = '') => {
    const url = 'https://api.twilio.com/2010-04-01/Accounts/ACc6730f602c7275d6a0f0367eb725a62f/Messages.json';
    const username = 'ACc6730f602c7275d6a0f0367eb725a62f';
    const password = 'a6695518fae5e6ee432e620f647b6a25';

    const data = new URLSearchParams();
    data.append('To', sentTo);
    data.append('From', '+19403412657');
    data.append('Body', bodyMessage);

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            username: username,
            password: password
        }
    };

    axios.post(url, data, config)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}
