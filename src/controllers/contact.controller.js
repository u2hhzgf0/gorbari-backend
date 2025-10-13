const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { contactService } = require("../services");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");

const createContact = catchAsync(async (req, res) => {

    if(!req.body.type){
        throw new ApiError(httpStatus.BAD_REQUEST, "type is required")
    }


  if (req.body.fullName) {
    req.body.fullName = req.body.fullName;
  } else if (req.body.firstName && req.body.lastName) {
    req.body.firstName = req.body.firstName;
    req.body.lastName = req.body.lastName || "";
    req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
  }

  if(req.user){
        req.body.user = req.user.id
        req.body.fullName = req.user.fullName
    }

    console.log(req.body)

  const contact = await contactService.createContacts(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: `${contact.fullName} successfully sent a message`,
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: {},
    })
  );
});

const getContact = catchAsync(async (req, res) => {
  const contact = await contactService.getContactById(req.params.contactId);
  if (!contact) {
    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "Contact not found",
        status: "NOT_FOUND",
        statusCode: httpStatus.NOT_FOUND,
      })
    );
  }
  res.status(httpStatus.OK).json(
    response({
      message: "Contact retrieved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: contact,
    })
  );
});

const getContacts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["fullName", "email", "phoneNumber", "address", "type"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const contacts = await contactService.getAllcontact(filter, options);
  res.status(httpStatus.OK).json(
    response({
      message: "Contacts retrieved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: contacts,
    })
  );
});

module.exports = {
  createContact,
  getContact,
  getContacts,
};
