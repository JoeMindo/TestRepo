import { expect } from "chai";
import nock from "nock";
import { BASEURL } from "../../src/core/urls.js";
import { registerUser } from "../../src/core/usermanagement.js";
import { renderRegisterMenu } from "../../src/menus/rendermenu.js";
import {
  registerResponse,
  registrationFailureMissingFields,
  registrationFailureDuplicateNumber,
  registrationFailurePasswordTooShort,
} from "./responses.js";
import { numberValidation } from "../../src/helpers.js";
import strings from "../../src/menus/strings.js";
import { getStrings } from "../../src/menus/language.js";

describe("Registration", () => {
  const registrationData = {
    phone_no: "+254710431513",
    first_name: "Test",
    last_name: "User",
    id_no: "345637271",
    role_id: "1",
    email: "user@email.com",
    password: "123456789",
    password_confirmation: "123456789",
    gender: "Male",
  };
  beforeEach(() => {
    // Success
    nock(`${BASEURL}`).post("/ussd/ussdRegister").reply(200, registerResponse);
    // Missing Fields
    nock(`${BASEURL}`)
      .post("/ussd/ussdRegister")
      .reply(200, registrationFailureMissingFields);
    nock(`${BASEURL}`)
      .post("/ussd/ussdRegister")
      .reply(200, registrationFailureDuplicateNumber);
    nock(`${BASEURL}`)
      .post("/ussd/ussdRegister")
      .reply(200, registrationFailurePasswordTooShort);
  });
  it("should return successfull if data is valid", async () => {
    const registerResponse = await registerUser(registrationData);

    expect(registerResponse.data.status).to.equal("success");
    expect(registerResponse.data.data.first_name).to.equal("Test");
  });
  it("should return error if fields are missing", async () => {
    const registrationData = {
      phone_no: null,
      password: null,
      password_confirmation: null,
      role_id: null,
    };
    const response = await registerUser(registrationData);
    const errorsDisplayed = {
      phone_no: ["The phone no field is required."],
      password: ["The password field is required."],
      role_id: ["The role id must be a string."],
    };

    expect(response.data.status).to.equal("error");
    expect(response.data.errors.phone_no[0]).to.equal(
      errorsDisplayed.phone_no[0]
    );
    expect(response.data.errors.password[0]).to.equal(
      errorsDisplayed.password[0]
    );
    expect(response.data.errors.role_id[0]).to.equal(
      errorsDisplayed.role_id[0]
    );
  });
  it("should return error if number exists", async () => {
    const data = {
      phone_no: "0731951724",
      password: "somepassword",
      password_confirmation: "somepassword",
      role_id: "1",
    };
    const response = await registerUser(data);
    const errorsDisplayed = {
      phone_no: ["The phone no has already been taken."],
    };

    expect(response.data.status).to.equal("error");
    expect(response.data.errors.phone_no[0]).to.equal(
      errorsDisplayed.phone_no[0]
    );
  });
  it("should return error if password is too short", async () => {
    const data = {
      phone_no: "+254712358743",
      password: "some",
      password_confirmation: "some",
      role_id: 1,
    };
    const response = await registerUser(data);
    const errorsDisplayed = {
      password: ["The password must be at least 8 characters."],
    };
    expect(response.data.status).to.equal("error");
    expect(response.data.errors.password[0]).to.equal(
      errorsDisplayed.password[0]
    );
  });
  it("first menu level should be to ask the first name", async () => {
    const text = "1";
    const textValue = 1;
    const phoneNumber = "+254719939291";
    const language = "en";
    const response = await renderRegisterMenu(
      textValue,
      text,
      phoneNumber,
      language
    );
    console.log("The response is", response);
    expect(response).to.equal("CON Enter your first name\n\n 00. Back 0.Home");
  });
  it("second menu level should be to ask the last name", async () => {
    const text = "1*Joe";
    const textValue = 2;
    const phoneNumber = "+254719939291";
    const language = "en";
    const response = await renderRegisterMenu(
      textValue,
      text,
      phoneNumber,
      language
    );
    expect(response).to.equal("CON Enter your last name\n\n 00. Back 0.Home");
  });
  it("third menu level should be to ask the ID Number", async () => {
    const text = "1*Joe*Mindo";
    const textValue = 3;
    const phoneNumber = "+254719939291";
    const language = "en";
    const response = await renderRegisterMenu(
      textValue,
      text,
      phoneNumber,
      language
    );
    expect(response).to.equal("CON Enter your ID number\n\n 00. Back 0.Home");
  });
  it("fourth menu level should be to ask the gender", async () => {
    const text = "1*Joe*Mindo*54712356";
    const textValue = 4;
    const phoneNumber = "+254719939291";
    const language = "en";
    const response = await renderRegisterMenu(
      textValue,
      text,
      phoneNumber,
      language
    );
    expect(response).to.equal(
      "CON What is the gender\n1. Male\n2. Female\n 00. Back 0.Home"
    );
  });
  it("fifth menu level should be to ask the password", async () => {
    const text = "1*Joe*Mindo*54712356*1";
    const textValue = 5;
    const language = "en";
    const menus = getStrings(strings, language);
    const validationResponse = numberValidation(text, 4, menus);
    console.log("The validaton response is", validationResponse);
    const phoneNumber = "+254719939291";

    const response = await renderRegisterMenu(
      textValue,
      text,
      phoneNumber,
      language
    );
    if (validationResponse === "valid") {
      expect(response).to.equal("CON Enter your password\n 00. Back 0.Home");
    } else {
      expect(response).to.equal("END Choose option 1 or 2");
    }
  });
  it("sixth menu level should be to ask the password confirmation", async () => {
    const text = "1*Joe*Mindo*54712356*12345678";
    const textValue = 6;
    const language = "en";
    const phoneNumber = "+254719939291";
    const response = await renderRegisterMenu(
      textValue,
      text,
      phoneNumber,
      language
    );
    expect(response).to.equal("CON Confirm your password\n 00. Back 0.Home");
  });
  it("seventh menu level should be to ask for the role", async () => {
    const text = "1*Joe*Mindo*54712356*12345678*12345678";
    const language = "en";
    const phoneNumber = "+254719939291";
    const textValue = 7;
    const response = await renderRegisterMenu(
      textValue,
      text,
      phoneNumber,
      language
    );
    expect(response).to.equal(
      "CON What is your role\n1. Farmer\n2. Buyer\n 00. Back 0.Home"
    );
  });
  it("last menu level should prompt the user to submit their details", async () => {
    const text = "1*Joe*Mindo*54712356*12345678*12345678*1";
    const textValue = 8;
    const language = "en";
    const phoneNumber = "+254719939291";
    const menus = getStrings(strings, language);
    const validationResponse = numberValidation(text, 7, menus);
    const response = await renderRegisterMenu(
      textValue,
      text,
      phoneNumber,
      language
    );
    if (validationResponse === "valid") {
      expect(response).to.equal(
        "CON Submit details?\n 1.Yes\n 00. Back 0.Home"
      );
    } else {
      expect(response).to.equal("END Choose option only the listed options");
    }
  });
});
