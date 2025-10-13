const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Contact } = require("../models");
const { sendContactsUsEmail } = require("./email.service");
const userService = require("./user.service");

// Create a new contact
const createContacts = async (data) => {
  const newContact = await Contact.create(data);

  if (data.type === "property") {
    const propertyWoner = await userService.getUserById(data.propertyWoner);
    sendContactsUsEmail({
      ...data,
      propertyOwnerEmail: propertyWoner.email,
    });
  } else {
    sendContactsUsEmail(data);
  }

  return newContact;
};

// Get a contact by ID
const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId).populate("user property propertyWoner");
  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
  }
  return contact;
};

const getAllcontact = async (filter, options) => {
  const query = {};

  for (const key of Object.keys(filter)) {
    if (
      (key === "fullName" ||
        key === "email" ||
        key === "type" ||
        key === "phoneNumber" ||
        key === "address") &&
      filter[key] !== ""
    ) {
      query[key] = { $regex: filter[key], $options: "i" };
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const contacts = await Contact.paginate(query, options);
  return contacts;
};

module.exports = {
  createContacts,
  getContactById,
  getAllcontact,
};
