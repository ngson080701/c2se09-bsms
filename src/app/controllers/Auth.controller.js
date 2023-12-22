import { Customer } from "../models/Customer/Customer.model.js";
import { Staff } from "../models/Staff/Staff.model.js";
import OTP from "../models/OTP.model.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import axios from "axios";
import jwt from "jsonwebtoken";
import {sendMail} from "../utitls/mail.js";
import {sendSMS} from "../utitls/sms.js";
import {convertPhoneNumber, isEmpty, validEmail} from "../utitls/index.js";

// *Useful for getting environment vairables
dotenv.config();

// Register for customer don't have account

export const RegisterForCustomer = async (req, res) => {
  const responseType = {
    status: 200,
    message: "Success",
  };
  const input = req.body;
  console.log(input);

  // Uncomment this section if you want to use reCaptcha verification
  /*
  if (!req.body.token) {
    responseType.message = "reCaptcha token is missing";
    responseType.status = 400;
    return res.json(responseType);
  }
  try {
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.token}`;
    const response = await axios.post(googleVerifyUrl);
    const { success } = response.data;
    if (!success) {
      responseType.message = "reCaptcha is invalid";
      responseType.status = 400;
      return res.json(responseType);
    }
  } catch (error) {
    console.log(error);
    responseType.message = "reCaptcha is error";
    responseType.status = 400;
    return res.json(responseType);
  }
  */

  try {
    if (!isEmpty(input.Email)) {
      const checkEmail = await Customer.findOne({ Email: input.Email });
      if (!isEmpty(checkEmail)) {
        responseType.status = 300;
        responseType.message = "Email is already registered!";
        return res.json(responseType);
      }
    }

    if (!isEmpty(input.Telephone)) {
      const checkTelephone = await Customer.findOne({ Telephone: input.Telephone });
      if (!isEmpty(checkTelephone)) {
        responseType.status = 300;
        responseType.message = "Telephone is already registered!";
        return res.json(responseType);
      }
    }

    const salt = bcryptjs.genSaltSync(10);
    const hashPassword = bcryptjs.hashSync(input.Password, salt);

    const newCustomer = new Customer({
      Name_Customer: input.Name_Customer,
      Telephone: input.Telephone,
      Email: input.Email,
      Password: hashPassword,
    });

    // Save the new customer to the database
    const saveCustomer = await newCustomer.save();
    responseType.message = "Register Successfully";
    responseType.value = saveCustomer;

    let otpcode = Math.floor(Math.random() * 100000 + 1);
    let otpData = new OTP({
      email: input.Telephone,
      code: otpcode,
      expireIn: new Date().getTime() + 300 * 1000,
      isVerified: false,
      type: 'register',
    });
    let otpResponse = await otpData.save();
    sendSMS(convertPhoneNumber(input.Telephone), `Verify register OTP :${otpcode}`);

    return res.json(responseType);
  } catch (error) {
    console.log(error);
    responseType.message = "An error occurred during registration";
    responseType.status = 500; // Internal Server Error
    return res.json(responseType);
  }
};

// Login for customer have account

export const LoginForCustomer = async (req, res) => {
  const responseType = {};
  if (!req.body.token) {
    responseType.message = "reCaptcha token is missing";
    responseType.status = 400;
  }
  try {
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.token}`;
    const response = await axios.post(googleVerifyUrl);
    const { success } = response.data;
    if (success) {
      const user = await Customer.findOne({Telephone: req.body.Email}).exec();
      if (isEmpty(user)) {
        responseType.status = 300;
        responseType.message = "Account was wrong!";
        res.json(responseType);
        return;
      }

      try {
        const match = bcryptjs.compare(req.body.Password, user.Password);
        if (!match) {
          responseType.status = 301;
          responseType.message = "Password not match!";
          res.json(responseType);
          return;
        } else {

          let otpcode = Math.floor(Math.random() * 100000 + 1);

          if (!user?.IsVerified) {
            let otpData = new OTP({
              email: req.body.Email,
              code: otpcode,
              expireIn: new Date().getTime() + 300 * 1000,
              isVerified: false,
              type: 'register',
            });
            let otpResponse = await otpData.save();
            sendSMS(convertPhoneNumber(req.body.Email), `Verify register OTP :${otpcode}`);

            responseType.status = 200;
            responseType.message = "Verify register OTP";
            responseType.value = user;
            res.json(responseType);
            return;
          }

          let otpData = new OTP({
            email: req.body.Email,
            code: otpcode,
            expireIn: new Date().getTime() + 300 * 1000,
            isVerified: false,
            type: 'login',
          });
          let otpResponse = await otpData.save();
          sendSMS(convertPhoneNumber(req.body.Email), `Verify login OTP :${otpcode}`);


          responseType.status = 200;
          responseType.message = "Login Successfully";
          responseType.value = user;
          res.json(responseType);
          return;
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      responseType.status = 400;
      responseType.message = "reCaptcha is invalid";
    }
  } catch (error) {
    responseType.message = "reCaptcha is error";
    responseType.status = 400;
  }

  res.json(responseType);
};

export const changePasswordWithOldPassword = async (req, res) => {
  const newPassword = req.body.newPassword;
  const pass = req.body.Password;
  const id = req.params.id;
  const responseType = {};

  try {
    const user = await Customer.findById({ _id: id });
    if (!user) {
      responseType.message = "Customer not found";
    }
    // valid old Password
    const check = await bcryptjs.compare(pass, user.Password);
    if (!check) {
      responseType.message = "Old password is wrong";
      responseType.status = 500;
    } else {
      const salt = bcryptjs.genSaltSync(10);
      const newPass = await newPassword;
      const hashPassword = bcryptjs.hashSync(newPass, salt);
      // update password with new pass word
      user.Password = hashPassword;
      const updated = await user.save();
      responseType.message = "Password change successfully";
      responseType.status = 200;
      responseType.value = updated;
    }
  } catch (err) {
    responseType.message = "Update password was failed";
  }

  res.json(responseType);
};

// reset password with otp code
// Change password for customer
export const ChangePassword = async (req, res) => {
  let data = await OTP.find({
    email: req.body.Email,
    code: req.body.code,
  });
  const response = {};
  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if (diff < 0) {
      response.message = "Token Expire";
      response.statusText = "Error";
    } else {
      let user = await Customer.findOneAndUpdate(
        {
          Email: req.body.Email,
        },
        {
          Password: req.body.Password,
        },
        {
          new: true,
        }
      );
      user.save();
      response.message = "Password change successfully";
      response.statusText = "Success";
    }
  } else {
    response.statusText = "Error";
    response.message = "Wrong OTP";
  }
  res.status(200).json(response);
};

// nodemailer
// send mail to get otp

//Initialize(Khởi tạo) OAuth2Client with Client ID and Client Secret
const GOOGLE_MAILER_CLIENT_ID = process.env.CLIENT_ID_CONTACT;
const GOOGLE_MAILER_CLIENT_SECRET = process.env.CLIENT_SECRET_CONTACT;
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.REFRESH_TOKEN_ADMIN;
const ADMIN_EMAIL_ADDRESS = process.env.EMAIL_ADMIN;

const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});

// Send email for customer
export const SendEmail = async (req, res) => {
  let data = await Customer.findOne({
    Email: req.body.Email,
  });
  const responseType = {};
  if (data) {
    let otpcode = Math.floor(Math.random() * 100000 + 1);
    let otpData = new OTP({
      email: req.body.Email,
      code: otpcode,
      expireIn: new Date().getTime() + 300 * 1000,
    });
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;

    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });
    const mailOptions = {
      to: req.body.Email, // Gửi đến ai?
      subject: "OTP  FOR CHANGE PASSWORD", // Tiêu đề email
      html: `
        Confirm your OTP to change your password :
      <h3>${otpcode}</h3>`, // Nội dung email
    };
    await transport.sendMail(mailOptions);

    let otpResponse = await otpData.save();
    responseType.statusText = "Success";
    responseType.status = 200;
    responseType.message = "Please check your Email!";
  } else {
    responseType.statusText = "Error";
    responseType.status = 304;
    responseType.message = "Email id not exist";
  }
  // return responseType to front-end check error
  res.json(responseType);
};

export const sendVerifyOTP = async (req, res) => {
  const otp = await OTP.findOne({
    email: req.body.Email,
    code: req.body.Otp,
    expireIn: { $gte: new Date().getTime() },
    isVerified: false,
    type: 'login'
  }).exec();
  const responseType = {};
  if (!otp) {
    responseType.message = "The OTP code has expired or is incorrect";
    responseType.status = 500;
    res.json(responseType);
    return;
  }

  otp.isVerified = true;
  await otp.save();

  responseType.message = "Success";
  responseType.status = 200;
  res.json(responseType);
}

export const verifyRegisterOTP = async (req, res) => {
  const otp = await OTP.findOne({
    email: req.body.Email,
    code: req.body.Otp,
    expireIn: { $gte: new Date().getTime() },
    isVerified: false,
    type: 'register'
  }).exec();
  const responseType = {};
  if (!otp) {
    responseType.message = "The OTP code has expired or is incorrect";
    responseType.status = 500;
    res.json(responseType);
    return;
  }


  const customer = await Customer.findOne({
    Telephone: req.body.Email
  }).exec();
  if (!customer) {
    responseType.message = "Customer verify not found";
    responseType.status = 500;
    res.json(responseType);
    return;
  }

  customer.IsVerified = true;
  await customer.save();

  otp.isVerified = true;
  await otp.save();

  responseType.message = "Success";
  responseType.status = 200;
  res.json(responseType);
}

// Login for staff
export const LoginForStaff = async (req, res) => {
  const responseType = {};

  try {
    const user = await Staff.findOne({
      Email: req.body.Email,
    });

    if (!user) {
      responseType.status = 300;
      responseType.message = "Email is wrong!";
    }

    const match = bcryptjs.compare(req.body.Password, user.Password);
    if (!match) {
      responseType.status = 301;
      responseType.message = "Password not match!";
    } else {
      responseType.status = 200;
      responseType.message = "Login Successfully";
      responseType.value  = user
      let token = jwt.sign(
        { data: user },
        process.env.SECRET_KEY,
        { expiresIn: "10 days" } //thời gian tồn tại của token
      );
      console.log(token)
      responseType.token = token;
    }
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    responseType.message = "reCaptcha is error";
    responseType.status = 400;
  }
  return res.status(200).json(responseType)
};

// change password for staff
export const ChangePasswordStaff = async (req, res) => {
  let data = await OTP.find({
    email: req.body.Email,
    code: req.body.code,
  });
  const response = {};
  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if (diff < 0) {
      response.message = "Token Expire";
      response.statusText = "Error";
    } else {
      let user = await Staff.findOneAndUpdate(
        {
          Email: req.body.Email,
        },
        {
          Password: req.body.Password,
        },
        {
          new: true,
        }
      );
      user.save();
      response.message = "Password change successfully";
      response.statusText = "Success";
    }
  } else {
    response.statusText = "Error";
    response.message = "Wrong OTP";
  }
  res.status(200).json(response);
};

// Send email for customer
export const SendEmailStaff = async (req, res) => {
  let data = await Staff.findOne({
    Email: req.body.Email,
  });
  const responseType = {};
  if (data) {
    let otpcode = Math.floor(Math.random() * 100000 + 1);
    let otpData = new OTP({
      email: req.body.Email,
      code: otpcode,
      expireIn: new Date().getTime() + 300 * 1000,
    });
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;

    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });
    const mailOptions = {
      to: req.body.Email, // Gửi đến ai?
      subject: "OTP  FOR CHANGE PASSWORD", // Tiêu đề email
      html: `
        Confirm your OTP to change your password : 
      <h3>${otpcode}</h3>`, // Nội dung email
    };
    await transport.sendMail(mailOptions);

    let otpResponse = await otpData.save();
    responseType.statusText = "Success";
    responseType.status = 200;
    responseType.message = "Please check your Email!";
  } else {
    responseType.statusText = "Error";
    responseType.status = 304;
    responseType.message = "Email id not exist";
  }
  // return responseType to front-end check error
  res.json(responseType);
};

export const ChangePasswordWithOldPasswordForStaff = async (req, res) => {
  const newPassword = req.body.newPassword;
  const pass = req.body.Password;
  const id = req.params.id;
  const responseType = {};

  try {
    const user = await Staff.findById({ _id: id });
    if (!user) {
      responseType.message = "Customer not found";
    }
    // valid old Password
    const check = await bcryptjs.compare(pass, user.Password);
    if (!check) {
      responseType.message = "Old password is wrong";
      responseType.status = 500;
    } else {
      const salt = bcryptjs.genSaltSync(10);
      const newPass = await newPassword;
      const hashPassword = bcryptjs.hashSync(newPass, salt);
      // update password with new pass word
      user.Password = hashPassword;
      const updated = await user.save();
      responseType.message = "Password change successfully";
      responseType.status = 200;
      responseType.value = updated;
    }
  } catch (err) {
    responseType.message = "Update password was failed";
  }

  res.json(responseType);
};
