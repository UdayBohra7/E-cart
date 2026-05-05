import { Button } from "@/components/Elements";
import { Form, InputDate, InputField } from "@/components/Form";
import { InputPhone } from "@/components/Form/InputPhone";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { z } from "zod";
import { createUser } from "../apis/user";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import { axios } from "@/lib/axios";
import AddEditUserForm from "./Users/AddEditForm";


const schema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z
    .string()
    .min(1, "Please enter email address")
    .email("Please enter a valid email address!"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  dob: z.date().optional(),
  username: z.string().min(1, "Please enter a username"),
  bio: z.string().optional(),
  country: z.string().min(1, "Please select your country"),
  addressLine1: z.string().min(1, "Please enter your address line 1"),
  addressLine2: z.string().optional(),
  suburb: z.string().min(1, "Please enter your suburb"),
  state: z.string().min(1, "Please enter your state"),
  postcode: z.string(),
  businessLocation: z.string().min(1, "Please enter your location"),
});

type UserValues = {
  name: string;
  email: string;
  phone: string;
  dob?: any;
  username: string;
  bio: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  suburb: string;
  state: string;
  postcode: string;
  businessLocation: string;
};

const AddUser = () => {
  return (
    <AddEditUserForm isEdit={false} />
  )
};

export default AddUser;
