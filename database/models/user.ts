import mongoose, {Types} from "mongoose"

export interface IUser {
  _id: Types.ObjectId
  firstName: string;
  lastName: string;
  password?: string;
  authProvider?: string;
  email: string;
  projects: Types.ObjectId
}

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
      unique: true,
      trim: true,
      validate: {
          validator: function (email:string) {
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
