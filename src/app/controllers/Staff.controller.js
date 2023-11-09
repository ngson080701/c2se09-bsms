import { Staff, DateSchedule, Slot } from "../models/Staff/Staff.model.js";
import bcryptjs from "bcryptjs";
import { Banner, Store } from "../models/Store/Store.model.js";
// create information of Staff
// COMPLETE in back-end
export const CreateStaff = async (req, res) => {
  const responseType = {};
  const input = req.body;
  //create new user
  console.log("====================================");
  console.log(input);
  console.log("====================================");
  try {
    const salt = bcryptjs.genSaltSync(10);
    const pass = await input.Password;
    const hashPassword = bcryptjs.hashSync(pass, salt);
    console.log("====================================");
    console.log(hashPassword);
    console.log("====================================");
    const newStaff = new Staff({
      Name: input.Name,
      Telephone: input.Telephone,
      Email: input.Email,
      Password: hashPassword,
      Image: input.Image,
      Gender: input.Gender,
      store: input.storeId,
      storeManager: input.storeManager,
      isAdmin: false,
    });
    //save Customer in database and return response
    const save = await newStaff.save();
    responseType.message = "Create new staff successfully";
    responseType.status = 200;
    responseType.value = save;
  } catch {
    responseType.status = 404;
    responseType.message = "Create staff failed";
  }
  res.json(responseType);
};

// update information of Staff
// COMPLETE in back-end
export const UpdateStaff = async (req, res) => {
  const responseType = {};
  // check input
  if (req.body.StaffId === req.params.id) {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    const save = await staff.save();
    responseType.statusText = "Success";
    responseType.message = "Update successfully";
    responseType.status = 200;
    responseType.value = save;
  } else {
    responseType.statusText = "Error";
    responseType.message = "Update Failed ";
    responseType.status = 404;
  }
  res.json(responseType);
};

// delete information of Staff
// COMPLETE in back-end
export const DeleteStaff = async (req, res) => {
  const responseType = {};
  try {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
      await Staff.findByIdAndDelete(req.params.id);
      responseType.statusText = "Success";
      responseType.message = "Delete Successfully";
      responseType.status = 200;
    } else {
      return res.status(400).json({ error: "khong co nhan vien" });
    }
  } catch {
    responseType.statusText = "Failed";
    responseType.message = "Delete Failed";
    responseType.status = 500;
  }
  res.json(responseType);
};

// get information of Staff by id
// COMPLETE in back-end
export const GetStaffById = async (req, res) => {
  const responseType = {};
  if (Staff) {
    const staff = await Staff.findById(req.params.id);
    responseType.statusText = "Success";
    responseType.message = "Get customer successfully";
    responseType.status = 200;
    responseType.value = staff;
  } else {
    responseType.statusText = "Error";
    responseType.message = "We have error in somewhere";
    responseType.status = 404;
  }
  res.json(responseType);
};

// get all information of Staff
// COMPLETE in back-end
export const GetStaffs = async (req, res) => {
  const responseType = {};
  if (Staff) {
    const staff = await Staff.find({ Name: { $ne: "Admin" } }).populate({
      path: "store",
    });
    const data = staff.map((item) => {
      const dataItem = {
        _id: item._id,
        Name: item.Name,
        Telephone: item.Telephone,
        Email: item.Email,
        Password: item.Password,
        Image: item.Image,
        Number: item.Number,
        Street: item.Street,
        District: item.District,
        City: item.City,
        Active: item.Active,
        Salary: item.Salary,
        Gender: item.Gender,
        store: item.store._id,
        nameStore: item.store.Name_Store,
      };
      return dataItem;
    });

    console.log(data);
    responseType.statusText = "Success";
    responseType.message = "Get customer successfully";
    responseType.status = 200;
    responseType.value = data;
  } else {
    responseType.statusText = "Error";
    responseType.message = "We have error in somewhere";
    responseType.status = 404;
  }
  res.json(responseType);
};
export const GetStaffByStore = async (req, res) => {
  const { staffId } = req.body;
  try {
    const staff = await Staff.find({ store: staffId });
    return res.status(200).json(staff);
  } catch (error) {
    return res.status(404).json(error);
  }
};

// count staff
// COMPLETE in back-end
export const CountStaff = async (req, res) => {
  const responseType = {};
  if (Staff) {
    const count = await Staff.countDocuments({});
    responseType.statusText = "Success";
    responseType.message = "Count customer successfully";
    responseType.status = 200;
    responseType.value = count;
  } else {
    responseType.statusText = "Error";
    responseType.message = "We have error in somewhere";
    responseType.status = 404;
  }
  res.json(responseType);
};

// get time of date
export const GetTime = async (req, res) => {
  const responseType = {};
  const input = req.body;
  const date = input.date;

  if (DateSchedule) {
    const data = await DateSchedule({
      date: date,
    });
    responseType.message = "Get dates successfully";
    responseType.status = 200;
    responseType.value = data;
  } else {
    responseType.statusText = "Error";
    responseType.message = "We have error in somewhere";
    responseType.status = 404;
  }
  res.json(responseType);
};

// get all date
// can get
export const GetAllDate = async (req, res) => {
  const responseType = {};
  const input = req.body;

  if (Staff) {
    const data = await Staff.find({
      Dates: { date: input.date },
    });
    responseType.message = "Get dates successfully";
    responseType.status = 200;
    responseType.value = data;
  } else {
    responseType.statusText = "Error";
    responseType.message = "We have error in somewhere";
    responseType.status = 404;
  }
  res.json(responseType);
};

export const CreateStaffs = async (req, res) => {
  const responseType = {};
  const input = req.body;

  const storeId = req.user.data.store;
  //create new user
  console.log("====================================");
  console.log(input);
  console.log("====================================");
  try {
    const salt = bcryptjs.genSaltSync(10);
    const pass = await input.Password;
    const hashPassword = bcryptjs.hashSync(pass, salt);
    console.log("====================================");
    console.log(hashPassword);
    console.log("====================================");
    const newStaff = new Staff({
      Name: input.Name,
      Telephone: input.Telephone,
      Email: input.Email,
      Password: hashPassword,
      Image: input.Image,
      Gender: input.Gender,
      store: storeId || input.storeId,
      storeManager: input.storeManager,
      isAdmin: false,
    });
    //save Customer in database and return response
    const save = await newStaff.save();
    responseType.message = "Create new staff successfully";
    responseType.status = 200;
    responseType.value = save;
  } catch {
    responseType.status = 404;
    responseType.message = "Create staff failed";
  }
  res.json(responseType);
};
