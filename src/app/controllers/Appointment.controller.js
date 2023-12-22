import Appointment from "../models/Appointment.model.js";
import {
    Staff,
    Salary,
    Slot,
    DateSchedule,
} from "../models/Staff/Staff.model.js";
import {Banner, Store} from "../models/Store/Store.model.js";

import {Service} from "../models/Service/Service.model.js";
import nodemailer from "nodemailer";
import {OAuth2Client} from "google-auth-library";
import moment from "moment";
import dotenv from "dotenv";
import {Customer} from "../models/Customer/Customer.model.js";
import {checkFutureDateTime, convertPhoneNumber, isEmpty} from "../utitls/index.js";
import {sendMail} from "../utitls/mail.js";
import {sendSMS} from "../utitls/sms.js";
// *Useful for getting environment vairables
dotenv.config();

// function create new slot for get slots from staff
function createDate(date) {
    return new DateSchedule({
        date: date,
        slots: [
            new Slot({
                Time: "08:00",
                isBooked: false,
            }),
            new Slot({
                Time: "08:30",
                isBooked: false,
            }),
            new Slot({
                Time: "09:00",
                isBooked: false,
            }),
            new Slot({
                Time: "09:30",
                isBooked: false,
            }),
            new Slot({
                Time: "10:00",
                isBooked: false,
            }),
            new Slot({
                Time: "10:30",
                isBooked: false,
            }),
            new Slot({
                Time: "11:00",
                isBooked: false,
            }),
            new Slot({
                Time: "11:30",
                isBooked: false,
            }),
            new Slot({
                Time: "12:00",
                isBooked: false,
            }),
            new Slot({
                Time: "12:30",
                isBooked: false,
            }),

            new Slot({
                Time: "13:00",
                isBooked: false,
            }),
            new Slot({
                Time: "13:30",
                isBooked: false,
            }),
            new Slot({
                Time: "14:00",
                isBooked: false,
            }),
            new Slot({
                Time: "14:30",
                isBooked: false,
            }),
            new Slot({
                Time: "15:00",
                isBooked: false,
            }),
            new Slot({
                Time: "15:30",
                isBooked: false,
            }),
            new Slot({
                Time: "16:00",
                isBooked: false,
            }),
            ,
            new Slot({
                Time: "16:30",
                isBooked: false,
            }),
            ,
            new Slot({
                Time: "17:00",
                isBooked: false,
            }),
            new Slot({
                Time: "17:30",
                isBooked: false,
            }),
        ],
    });
}

// get-slots
// check complete success
export const GetSlots = async (req, res) => {
    const slots = [
        {Time: "08:00", isBooked: false},
        {Time: "08:30", isBooked: false},
        {Time: "09:00", isBooked: false},
        {Time: "09:30", isBooked: false},
        {Time: "10:00", isBooked: false},
        {Time: "10:30", isBooked: false},
        {Time: "11:00", isBooked: false},
        {Time: "11:30", isBooked: false},
        {Time: "12:00", isBooked: false},
        {Time: "12:30", isBooked: false},
        {Time: "13:00", isBooked: false},
        {Time: "13:30", isBooked: false},
        {Time: "14:00", isBooked: false},
        {Time: "14:30", isBooked: false},
        {Time: "15:00", isBooked: false},
        {Time: "15:30", isBooked: false},
        {Time: "16:00", isBooked: false},
        {Time: "16:30", isBooked: false},
        {Time: "17:00", isBooked: false},
        {Time: "17:30", isBooked: false}
    ];

    try {
        const storeId = req.body.storeId; //store id
        const userId = req.body.userId; //user id
        const date = req.body.date; // date to booking appointment
        // const today = new Date();
        // today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00

        const query = {
            store: storeId,
            CustomerId: userId,
            date: date,
            Status: 'pending',
        };

        const appointments = await Appointment.find(query);
        if (isEmpty(appointments)) {
            return res.status(200).json(slots);
        }

        const bookedTimes = appointments.map(item => item.slotTime);
        console.log('arrDates', bookedTimes);
        for (const slot of slots) {
            if (bookedTimes.includes(slot.Time)) {
                slot.isBooked = true;
            }
        }

        return res.status(200).json(slots);

    } catch (err) {
        return res.status(400).json(slots);
    }
};

export const GetByDateChoose = async (req, res) => {
    const responseType = {};
    const input = req.body;
    const start = input.Start;
    const end = input.End;
    try {
        const getByDate = await Appointment.aggregate([
            {$match: {createdAt: {$gte: new Date(start), $lt: new Date(end)}}},
            {$sort: {_id: 1}},
        ]);
        const length = getByDate.length;
        res.status(200).json(length);
    } catch (err) {
        res.status(400).json(err);
    }
};

async function sendMail1({templateName, params, service, store}) {
    const htmlContent = `<div className="order-summary text-center">
      <div>
        <h3>THANK YOU</h3>
        <p>You have successfully booked your seat.</p>
      </div>
      <div style="margin-left:20px">
      Date:&nbsp;
      <span className="orderid highlight">${params.date}</span>
    </div>
      <div style="margin-left:20px">
        Time:&nbsp;
        <span className="orderid highlight">${params.slotTime}</span>
      </div>
      <div style="margin-left:20px">
        Store name:&nbsp;
        <span className="orderid highlight">${store.Name_Store}</span>
      </div>
      <div style="margin-left:20px">
      Staff:&nbsp;
      <span className="orderid highlight">${params.Staff}</span>
    </div>
    <div style="margin-left:20px">
    Name Service:&nbsp;
    <span className="orderid highlight">${service.Name_Service}</span>
  </div>
  <div style="margin-left:20px">
    Description Service:&nbsp;
    <span className="orderid highlight">${service.Description}</span>
  </div>
  <div style="margin-left:20px">
  Price:&nbsp;
    <span className="orderid highlight">${service.Price}</span>
  </div>
  
      <div>

      We have successfully confirmed your reservation.</div>
      <div>

      If you have any questions about your booking, please get in touch
      Contact us via phone number: 099999999999
      </div>
    </div>`;

    await sendMail(params.Email, 'Booking schedule from the barber shop', htmlContent);

    // try {
    //   const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //       user: process.env.EMAIL,
    //       pass: process.env.PASSWORD,
    //     },
    //   });
    //   const mailOptions = {
    //     from: "Barber.noreply <Barber@Barber.com>",
    //     replyTo: "Barber@SanFont.com",
    //     to: params.Email,
    //     subject: "Booking schedule from the barber shopr",
    //     html: ``,
    //   };
    //
    //   // eslint-disable-next-line func-names
    //   transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log(`Email sent: ${info.response}`);
    //     }
    //   });
    //   return { message: "Success" };
    // } catch (e) {
    //   throw e;
    // }
}

// async..await is not allowed in global scope, must use a wrapper

// add new appointment
export const AddAppointment = async (req, res) => {
    const staffId = req.body.StaffId; // staff id
    const customerId = req.body.CustomerId; // Customer id
    const customerName = req.body.NameCustomer;
    const customerTelephone = req.body.TelephoneCustomer;
    const slotId = req.body.SlotId; // slot id
    const dateId = req.body.DateId;
    const dateBooking = req.body.date;
    const email = req.body.Email;
    const status = "pending";
    const manyService = req.body.Services;
    const storeId = req.body.storeId;
    const timeBooking = req.body.slotTime;
    const staffName = req.body.Staff_Name;

    const checkTime = checkFutureDateTime(dateBooking, timeBooking);
    if (!checkTime) {
        return res.status(422).json({error: 'Invalid set time'});
        return;
    }

    const resStore = await Store.findOne({_id: storeId}).exec();
    const resService = await Service.findOne({_id: manyService}).exec();
    const resCustomer = await Customer.findOne({_id: customerId}).exec();
    const resStaff = await Staff.findOne({_id: staffId}).exec();

    if (!resCustomer) {
        return res.status(404).json({error: "Not found customer"});
    }

    if (!resStaff) {
        return res.status(404).json({error: "Not found staff"});
    }

    if (!resStore) {
        return res.status(404).json({error: "Not found store"});
    }

    if (!resService) {
        return res.status(404).json({error: "Not found service"});
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const currentDatetime = `${year}-${month}-${day}`;
    const checkBookingCustomer = await Appointment.find({
        store: storeId,
        CustomerId: {$eq: customerId},
        date: {$gte: currentDatetime},
        Status: 'pending'
    }).exec();

    if (!isEmpty(checkBookingCustomer)) {
        return res.status(500).json({error: "Already on the appointment schedule"});
    }

    const newAppointment = new Appointment({
        StaffId: staffId,
        // DateId: dateId,
        SlotId: slotId,
        CustomerId: customerId,
        date: dateBooking,
        slotTime: timeBooking,
        Staff: staffName,
        NameCustomer: customerName,
        TelephoneCustomer: customerTelephone,
        Email: email,
        Services: manyService,
        Status: status,
        store: storeId,
        nameStore: resStore.Name_Store,
    });

    const phoneNumberCustomer = resCustomer?.Telephone;
    const emailCustomer = resCustomer?.Email;
    newAppointment
        .save()
        .then(async (appointment) => {

            if (!isEmpty(emailCustomer)) {
                sendMail1({
                    params: appointment,
                    service: resService,
                    store: resStore
                });

            }

            if (!isEmpty(phoneNumberCustomer)) {
                const messageSms = 'You have scheduled a day: ' + dateBooking + ' time: ' + timeBooking + ' Staff : ' + staffName;

                sendSMS(convertPhoneNumber(phoneNumberCustomer), messageSms);
            }
            return res.status(200).json({message: "success"});
        })

        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
};

// update information of Appointment
// for staff
// cancel
export const UpdateAppointment = async (req, res) => {
    const staffId = req.body.StaffId; // staff id
    const Staff_Name = req.body.Staff_Name; // staff id
    const customerId = req.body.CustomerId; // Customer id
    const customerName = req.body.NameCustomer;
    const customerTelephone = req.body.TelephoneCustomer;
    const slotId = req.body.SlotId; // slot id
    const dateId = req.body.DateId;
    const email = req.body.Email;
    const status = req.body.Status;
    const note = req.body.Note;
    const manyService = req.body.Services;

    Staff.findOne({_id: staffId}).then((staff) => {
        const date = staff.Dates.id(dateId);
        const slot = date.slots.id(slotId);
        slot.isBooked = true;
        const appointmentId = req.params.id;
        staff.save().then(() => {
            // create an entry in the appointment database
            const data = {
                StaffId: staffId,
                DateId: dateId,
                SlotId: slotId,
                CustomerId: customerId,
                date: date.date,
                slotTime: slot.Time,
                Staff: staff?.name,
                NameCustomer: customerName,
                TelephoneCustomer: customerTelephone,
                Email: email,
                Services: manyService,
                Status: status,
                Note: note,
            };
            Appointment.findByIdAndUpdate(
                {appointmentId},
                {$set: data},
                {
                    new: true,
                }
            )
                .exec()
                .then((appointment) => {
                    return res.status(200).json(appointment);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json(err);
                });
        });
    });
};

// delete information of Appointment for customer
export const UpdateCancelStatusAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const status = req.body.Status;
    try {
        const resAppointment = await Appointment.findOne({_id: appointmentId}).exec();
        if (isEmpty(resAppointment)) {
            res.status(400).json("Appointment Not found");
            return;
        }

        const resCustomer = await Customer.findOne({_id: resAppointment?.CustomerId}).exec();
        if (isEmpty(resCustomer)) {
            res.status(400).json("Customer booking Not found");
            return;
        }

        try {
            const update = await Appointment.findByIdAndUpdate(appointmentId, {Status: status}).exec();
            if (!isEmpty(resCustomer?.Email)) {
                const htmlContent = `<h3> You have successfully cancel an appointment at BarberJT </h3> <br>
            <p>
            Please check your appointment information at your personal account information </p>  <br>
           <b> Thank you for trusting our services</b>`;
                sendMail(resCustomer?.Email, 'BARBERSHOP HAIRCUT APPOINTMENTS CANCEL', htmlContent);
            }

            if (!isEmpty(resCustomer?.Telephone)) {
                const contentSms = 'BARBERSHOP HAIRCUT APPOINTMENTS CANCEL DATE: ' + resAppointment?.date  + ' TIME: ' + resAppointment?.slotTime;
                sendSMS(convertPhoneNumber(resCustomer?.Telephone), contentSms)
            }

            res.status(200).json("Success");
            return;
        } catch (e) {
            res.status(400).json("Update fails");
        }
    } catch (error) {
        res.status(400).json("Update fails");
    }

    // const staffId = req.body.StaffId;
    // const slotId = req.body.SlotId;
    // const dateId = req.body.DateId;
    // const status = req.body.Status;
    // const email = req.body.Email;
    // Staff.findOne({_id: staffId}).then((staff) => {
    //     const date = staff.Dates.id(dateId);
    //     const slot = date.slots.id(slotId);
    //     slot.isBooked = false;
    //     const appointmentId = req.params.id;
    //     staff.save().then(() => {
    //         // create an entry in the appointment database
    //         Appointment.findByIdAndUpdate(appointmentId, {Status: status})
    //             .exec()
    //             .then((status) => {
    //                 return res.status(200).json(status);
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //                 res.status(400).json(err);
    //             });
    //     });
    // });
    // const GOOGLE_MAILER_CLIENT_ID = process.env.CLIENT_ID_CONTACT;
    // const GOOGLE_MAILER_CLIENT_SECRET = process.env.CLIENT_SECRET_CONTACT;
    // const GOOGLE_MAILER_REFRESH_TOKEN = process.env.REFRESH_TOKEN_ADMIN;
    // const ADMIN_EMAIL_ADDRESS = process.env.EMAIL_ADMIN;
    // const myOAuth2Client = new OAuth2Client(
    //     GOOGLE_MAILER_CLIENT_ID,
    //     GOOGLE_MAILER_CLIENT_SECRET
    // );
    // // Set Refresh Token vào OAuth2Client Credentials
    // myOAuth2Client.setCredentials({
    //     refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
    // });
    //
    // const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    // const myAccessToken = myAccessTokenObject?.token;
    //
    // // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    // const transport = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         type: "OAuth2",
    //         user: ADMIN_EMAIL_ADDRESS,
    //         clientId: GOOGLE_MAILER_CLIENT_ID,
    //         clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
    //         refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
    //         accessToken: myAccessToken,
    //     },
    // });
    // const mailOptions = {
    //     to: email, // Gửi đến ai?
    //     subject: "BARBERSHOP HAIRCUT APPOINTMENTS CANCEL", // Tiêu đề email
    //     html: `<h3> You have successfully cancel an appointment at BarberJT </h3> <br>
    //  <p>
    //   Please check your appointment information at your personal account information </p>  <br>
    //  <b> Thank you for trusting our services</b>`, // Nội dung email
    // };
    // await transport.sendMail(mailOptions);
};

// get information of Appointment by id
export const GetAppointmentById = async (req, res) => {
    const responseType = {};
    try {
        const appointmentId = req.params.id;
        const appointment = await Appointment.findOne({
            _id: appointmentId,
        }).populate("store", "Name_Store");

        responseType.message = "Get appointment successfully";
        responseType.status = 200;
        responseType.value = appointment;
    } catch (err) {
        responseType.message = "Get appointment failed";
        responseType.status = 500;
    }
    res.json(responseType);
};

// post appointment today
export const AppointmentToday = async (req, res) => {
    try {
        const date = new Date();
        let currDate = date.getFullYear().toString();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        currDate += month < 10 ? "-0" + month.toString() : "-" + month.toString();
        currDate += day < 10 ? "-0" + day.toString() : "-" + day.toString();

        const staffId = req.body.staffId;

        const appointments = await Appointment.find({
            staffId: staffId,
            date: currDate,
        });

        const sortedAppointments = appointments.sort((a, b) => {
            return (
                Date.parse(a.date + "T" + a.slotTime) -
                Date.parse(b.date + "T" + b.slotTime)
            );
        });

        res.status(200).json(sortedAppointments);
    } catch (error) {
        res.status(404).json(error);
    }
};

// get all information of Appointment
export const GetAppointments = async (req, res) => {
    const responseType = {};
    try {
        const appointment = await Appointment.find();
        responseType.message = "Get appointment successfully";
        responseType.status = 200;
        responseType.value = appointment;
    } catch (error) {
        responseType.message = "Get appointment failed";
        responseType.status = 500;
    }
    res.json(responseType);
};

export const GetAppointmentByUserId = async (req, res) => {
    const responseType = {};
    const userId = req.query.UserId;
    try {
        const appointment = await Appointment.find({CustomerId: userId});
        responseType.message = "Get appointment successfully";
        responseType.status = 200;
        responseType.value = appointment;
    } catch (error) {
        responseType.message = "Get appointment failed";
        responseType.status = 500;
    }
    res.json(responseType);
};

export const GetAppointmentMatchPending = async (req, res) => {
    const userId = req.query.UserId;
    const responseType = {};
    try {
        const appointment = await Appointment.find({
            $and: [{CustomerId: userId}, {Status: "pending"}],
        }).sort({date: -1, slot: 1});
        responseType.message = "Get appointment successfully";
        responseType.status = 200;

        responseType.value = appointment;
    } catch (error) {
        responseType.message = "Get appointment failed";
        responseType.status = 500;
    }
    res.json(responseType);
};

export const GetAppointmentMatchCancel = async (req, res) => {
    const userId = req.query.UserId;
    const responseType = {};
    try {
        const appointment = await Appointment.find({
            $and: [{CustomerId: userId}, {Status: "cancel"}],
        }).sort({date: -1});
        responseType.message = "Get appointment successfully";
        responseType.status = 200;
        responseType.value = appointment;
    } catch (error) {
        responseType.message = "Get appointment failed";
        responseType.status = 500;
    }
    res.json(responseType);
};

// get all appointment with status pending

export const GetAllAppointmentMatchPending = async (req, res) => {
    const currentDate = req.body.Date;
    const responseType = {};
    try {
        const appointment = await Appointment.find({
            $and: [{date: currentDate}, {Status: "pending"}],
        });
        responseType.message = "Get appointment successfully";
        responseType.status = 200;
        responseType.value = appointment;
    } catch (error) {
        responseType.message = "Get appointment failed";
        responseType.status = 500;
    }
    res.json(responseType);
};

// get all appointment with status pending

export const GetAllAppointmentMatchPendingWithRangeTime = async (req, res) => {
    const responseType = {};
    const start = req.body.Start;
    const end = req.body.End;
    try {
        const appointment = await Appointment.aggregate([
            {
                $match: {
                    $and: [{date: {$gte: start, $lt: end}}, {Status: "pending"}],
                },
            },
        ]);
        responseType.message = "Get appointment successfully";
        responseType.status = 200;
        responseType.value = appointment;
    } catch (error) {
        responseType.message = "Get appointment failed";
        responseType.status = 500;
    }
    res.json(responseType);
};

export const AppointmentPieChart = async (req, res) => {
    const responseType = {};
    const start = req.body.Start;
    const end = req.body.End;
    try {
        const appointment = await Appointment.aggregate([
            {
                $match: {
                    $and: [{date: {$gte: start, $lt: end}}, {Status: "pending"}],
                },
            },
            {
                $group: {
                    _id: "$Staff",
                    count: {$sum: 1},
                },
            },
        ]);
        responseType.message = "Get appointment successfully";
        responseType.status = 200;
        responseType.value = appointment;
    } catch (error) {
        responseType.message = "Get appointment failed";
        responseType.status = 500;
    }
    res.json(responseType);
};

// get for current day staff
export const GetAppointmentForStaff = async (req, res) => {
    const input = req.body;
    const start = moment(input.Start).format("YYYY-MM-DD");
    const end = moment(input.End).add(1, "day").format("YYYY-MM-DD");
    const responseType = {};
    try {
        const appointment = await Appointment.find({
            $and: [{date: start}, {Staff: input.Staff}],
        });
        responseType.message = "Get appointment successfully";
        responseType.status = 200;
        responseType.value = appointment;
    } catch (error) {
        responseType.message = "Get appointment failed";
        responseType.status = 500;
    }
    res.json(responseType);
};

export const AllByStoreId = async (req, res) => {
    const {storeId} = req.body;
    try {
        const store = await Store.findOne({_id: storeId});
        console.log("check", store);
        if (store) {
            const appointment = await Appointment.find({store: storeId})
                .populate({
                    path: "store", // Chỉ định đường dẫn đến bảng cha "store"
                    // Chỉ định trường "name" từ bảng cha "store"
                })
                .populate({path: "Services"});
            if (appointment) {
                const data = appointment.map((item) => {
                    const dataItem = {
                        _id: item._id,
                        StaffId: item.StaffId,
                        DateId: item.DateId,
                        SlotId: item.SlotId,
                        CustomerId: item.CustomerId,
                        Staff: item.Staff,
                        NameCustomer: item.NameCustomer,
                        TelephoneCustomer: item.TelephoneCustomer,
                        Email: item.Email,
                        date: item.date,
                        slotTime: item.slotTime,
                        Status: item.Status,
                        Services: item.Services._id,
                        Name_Service: item.Services.Name_Service,
                        Price: item.Services.Price,
                        Name_Store: item.store.Name_Store,
                    };
                    return dataItem;
                });
                return res.status(200).json(data);
            } else {
                return res.status(404).json("cua hang chua co dat hang");
            }
        } else {
            return res.status(400).json({message: "Store not found"});
        }
    } catch (error) {
        return res.status(400).json({error: error});
    }
};

export const DeleteAppointmentByIdStore = async (req, res, next) => {
    const {id} = req.query;
    try {
        // const store = await Store.findById({ _id: storeId });
        const appointment = await Appointment.findById({_id: id});
        console.log(appointment);
        // if (store) {
        //   next;
        // } else {
        //   res.status(400).json({ error: "khong tim thay store" });
        // }
        if (appointment) {
            await Appointment.deleteOne({_id: id});
            return res.status(200).json({message: "DELETE SUCCESS"});
        } else {
            return res.status(400).json({error: "DO NOT FIND BOOKING"});
        }
    } catch (error) {
    }
};

export const UpdateApplicationStatus = async (req, res) => {
    const {id} = req.query;

    try {
        const application = await Appointment.findOne({_id: id});
        console.log(application);
        if (application) {
            await Appointment.updateOne({_id: id}, {Status: "Done"});

            return res.status(200).json("SUCCESS");
        } else {
            return res.status(404).json({error: "DO NOT FIND BOOKING"});
        }
    } catch (error) {
        return res.status(400).json({error: error});
    }
};
