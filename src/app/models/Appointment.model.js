import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema(
  {
    StaffId: {
      type: String,
      require: true,
    },
    DateId: {
      type: String,
      require: true,
    },
    SlotId: {
      type: String,
      require: true,
    },
    CustomerId: {
      type: String,
      require: true,
    },
    Staff: {
      type: String,
    },
    NameCustomer: {
      type: String,
    },
    TelephoneCustomer: {
      type: String,
    },
    Email: {
      type: String,
    },
    date: {
      type: String,
    },
    slotTime: {
      type: String,
    },
    Status: {
      type: String,
    },
    Services: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },

  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
