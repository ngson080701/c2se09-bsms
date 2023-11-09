import { Banner, Store } from "../models/Store/Store.model.js";
import { Staff } from "../models/Staff/Staff.model.js";

// create information of store
// COMPLETE
export const CreateStore = async (req, res) => {
  const responseType = {};
  const input = req.body;
  // validate input
  if (!input) {
    responseType.message = "isValid";
    responseType.statusText = "Error";
  }

  const newStore = new Store({
    Name_Store: input.Name_Store,
    Telephone: input.Telephone,
    Number: input.Number,
    Street: input.Street,
    District: input.District,
    City: input.City,
    Description: input.Description,
  });

  // save store in database
  const saveStore = await newStore.save();
  responseType.statusText = "Success";
  responseType.message = "Create successfully";
  responseType.status = 200;
  responseType.value = saveStore;
  res.json(responseType);
};

// update information of store
export const deleteStore = async (req, res) =>{
  const id = req.body;
  try{
    const store = await Store.findById({_id: id});
    if (store){
      const storedelete = await findByIdAndDelete({_id: id})
      return res.status(200).json("da xoa thanh cong")
    }else{
      return res.status(400).json({error:"khong co cua hang"})
    }
  }catch(err) {
    return res.status(500).json({err})
  }
}
// COMPLETE
export const UpdateStore = async (req, res) => {
  const responseType = {};
  const {id}= req.body;
  try {
    const store = await Store.findByIdAndUpdate(
      { _id: id },
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    const saveStore = await store.save();
    responseType.statusText = "Success";
    responseType.message = "Update successfully";
    responseType.status = 200;
    responseType.value = saveStore;
  } catch (err) {
    responseType.statusText = "Error";
    responseType.message = "Update Failed ";
    responseType.status = 404;
  }
  res.json(responseType);
};

// get information of store by id
// COMPLETE
export const GetStores = async (req, res) => {
  let storeId = [];
  const { q } = req.query;
  try {
    if (q) {
      storeId = await Store.findById({
      _id: q
      }).populate("");
      const user = await Staff.find({store: storeId._id})
      console.log(user)


      
    } else {
      storeId = await Store.find();

    }
    return res.status(200).json(storeId);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const GetById = async (req, res) => {};

// create banner for store to show in front-end
export const CreateBanner = async (req, res) => {
  const responseType = {};
  const input = req.body;

  if (!input) {
    responseType.message = "isValid";
    responseType.statusText = "Error";
  }
  const newBanner = new Banner({
    Image: input.Image,
    Description: input.Description,
  });

  const store = "64c27936e1bb3465f85b7f0c";
  const saveBanner = await newBanner.save();

  await Store.findOneAndUpdate(
    { _id: store },
    {
      $push: { Banner: saveBanner._id },
    },
    {
      new: true,
    }
  );
  try {
    responseType.message = "Create successfully";
    responseType.status = 200;
    responseType.value = saveBanner;
  } catch (error) {
    responseType.message = "Create failed";
    responseType.status = 400;
  }
  res.json(responseType);
};
//update banner
export const UpdateBanner = async (req, res) => {
  const responseType = {};
  const banner = await Banner.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    },
    {
      new: true,
    }
  );

  try {
    const saveBanner = await banner.save();
    responseType.message = "Update successfully";
    responseType.status = 200;
    responseType.value = saveBanner;
  } catch (error) {
    responseType.message = "Update failed";
    responseType.status = 400;
  }

  res.json(responseType);
};

// delete banner
export const DeleteBanner = async (req, res) => {
  const responseType = {};
  const store = "64c27936e1bb3465f85b7f0c";
  try {
    await Banner.findByIdAndDelete(req.params.bannerId);
    try {
      await Store.findOneAndUpdate(
        { _id: store },
        {
          $pull: { Banner: req.params.bannerId },
        },
        { new: true }
      );
      responseType.statusText = "Success";
      responseType.message = "Delete successfully";
      responseType.status = 200;
      res.json(responseType);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    responseType.statusText = "Failed";
    responseType.message = "Delete Failed";
    responseType.status = 500;
  }
};

export const getBanner = async (req, res) => {
  const responseType = {};
  if (Banner) {
    const banner = await Banner.find();
    responseType.statusText = "Success";
    responseType.message = "Update successfully";
    responseType.status = 200;
    responseType.value = banner;
  } else {
    responseType.statusText = "Error";
    responseType.message = "Update Failed ";
    responseType.status = 404;
  }
  res.json(responseType);
};

export const GetBannerWithId = async (req, res) => {
  const responseType = {};
  if (Banner) {
    const banner = await Banner.findById(req.params.id);

    responseType.message = "Update successfully";
    responseType.status = 200;
    responseType.value = banner;
  } else {
    responseType.message = "Update Failed ";
    responseType.status = 404;
  }
  res.json(responseType);
};
