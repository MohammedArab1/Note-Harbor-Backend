import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true
  },
  lastName: { 
    type: String, 
    required: true
  },
  password: { 
    type: String, 
    required: false,
    select: false
  },
  authProvider: { 
    type: String, 
    required: false,
    select: true
  },
  email: {
      type: String,
      required: [true, "An Email is required. Please provide an email."],
      unique: [true, "The email you've provided already exists."],
      trim: true,
      validate: {
          validator: function (email) {
            const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            return regex.test(email);
          },
          message: props => `${props.value} is not a valid email address!`
      }
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: [],
    }
  ]
});


export const User = mongoose.model("User", UserSchema);
