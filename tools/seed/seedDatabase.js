const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "../../config.env" });

// Load models
const BooksLibrary = require("./Model/books");

// Connect to DB
mongoose.connect(process.env.MONGO_URI + "/Library", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const library = JSON.parse(
  fs.readFileSync(`${__dirname}/booksCatalog.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await BooksLibrary.create(library);
    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await BooksLibrary.deleteMany();
    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}