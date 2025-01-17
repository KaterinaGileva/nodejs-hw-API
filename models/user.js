const {Schema, model} = require("mongoose");
const Joi = require("joi");
const bcrypt = require('bcrypt');
const {handleMongooseError} = require("../helpers");

const userSchema = new Schema({
        password: {
          type: String,
          required: [true, "Set password for user"],
        },
        email: {
          type: String,
          required: [true, "Email is required"],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter",
        },
        token: {
          type: String,
          default: null,
        },
        avatarURL: {
          type: String,
          required: true,
        },
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          required: [true, 'Verify token is required'],
        },
      
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    subscription: Joi.string().valid("starter", "pro", "business"),
});

userSchema.methods.setPassword = function(password){
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

const loginSchema = Joi.object({
   
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
        
});

const subscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
  });

const verifyEmailShema = Joi.object({
    email: Joi.string().email().required(),
});

const schemas = {
    registerSchema,
    loginSchema,
    subscriptionSchema,
    verifyEmailShema
}

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
  }
  