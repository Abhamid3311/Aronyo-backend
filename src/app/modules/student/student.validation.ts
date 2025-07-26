// import Joi from "joi";
import { z } from "zod";

// Zod
/* export const studentValidationSchemaByZod = z.object({
  id: z.string({
    required_error: "Student ID is required",
    invalid_type_error: "ID must be a string",
  }),
  password: z.string({
    required_error: "password is required",
    invalid_type_error: "password must be a string",
  }),

  name: z.object(
    {
      firstName: z
        .string({
          required_error: "First name is required",
        })
        .max(20, "First name must not exceed 20 characters")
        .regex(
          /^[A-Z][a-zA-Z]*$/,
          "First name must start with a capital letter and contain only letters"
        ),

      lastName: z
        .string({
          required_error: "Last name is required",
        })
        .max(20, "Last name must not exceed 20 characters")
        .regex(
          /^[A-Za-z]+$/,
          "Last name must contain only alphabetic characters"
        ),
    },
    {
      required_error: "Name object is required",
    }
  ),

  gender: z.enum(["male", "female", "others"], {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be 'male', 'female', or 'others'",
  }),

  dateOfBirth: z.string().optional(),

  phoneNumber: z.string({
    required_error: "Phone number is required",
  }),

  email: z
    .string({
      required_error: "Email address is required",
    })
    .email("Must be a valid email address"),

  bloodGroup: z.string({
    required_error: "Blood group is required",
  }),

  presentAddress: z.string({
    required_error: "Present address is required",
  }),

  parmanentsAddress: z.string({
    required_error: "Permanent address is required",
  }),

  gurdian: z.object(
    {
      fatherName: z.string({
        required_error: "Father's name is required",
      }),
      fatheroccupation: z.string({
        required_error: "Father's occupation is required",
      }),
      motherName: z.string({
        required_error: "Mother's name is required",
      }),
      contactNumber: z.string({
        required_error: "Guardian's contact number is required",
      }),
    },
    {
      required_error: "Guardian information is required",
    }
  ),

  profileImage: z.string().url("Profile image must be a valid URL").optional(),

  isActive: z
    .enum(["active", "blocked"], {
      invalid_type_error: "Status must be either 'active' or 'blocked'",
    })
    .default("active"),
  isDeleted: z.boolean(),
}); */

// Joi

/* export const studentValidationSchema = Joi.object({
    id: Joi.string().required().messages({
      "string.base": "ID must be a string",
      "any.required": "Student ID is required",
    }),

    name: Joi.object({
      firstName: Joi.string()
        .max(20)
        .pattern(/^[A-Z][a-zA-Z]*$/)
        .required()
        .messages({
          "string.pattern.base":
            "First name must start with a capital letter and contain only letters",
          "string.max": "First name must not exceed 20 characters",
          "any.required": "First name is required",
        }),
      lastName: Joi.string()
        .max(20)
        .pattern(/^[A-Za-z]+$/)
        .required()
        .messages({
          "string.pattern.base":
            "Last name must contain only alphabetic characters",
          "string.max": "Last name must not exceed 20 characters",
          "any.required": "Last name is required",
        }),
    })
      .required()
      .messages({
        "any.required": "Name object is required",
      }),

    gender: Joi.string()
      .valid("male", "female", "others")
      .required()
      .messages({
        "any.only": "Gender must be 'male', 'female', or 'others'",
        "any.required": "Gender is required",
      }),

    dateOfBirth: Joi.string().optional(),

    phoneNumber: Joi.string().required().messages({
      "any.required": "Phone number is required",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Must be a valid email address",
      "any.required": "Email address is required",
    }),

    bloodGroup: Joi.string().required().messages({
      "any.required": "Blood group is required",
    }),

    presentAddress: Joi.string().required().messages({
      "any.required": "Present address is required",
    }),

    parmanentsAddress: Joi.string().required().messages({
      "any.required": "Permanent address is required",
    }),

    gurdian: Joi.object({
      fatherName: Joi.string().required().messages({
        "any.required": "Father's name is required",
      }),
      fatheroccupation: Joi.string().required().messages({
        "any.required": "Father's occupation is required",
      }),
      motherName: Joi.string().required().messages({
        "any.required": "Mother's name is required",
      }),
      contactNumber: Joi.string().required().messages({
        "any.required": "Guardian's contact number is required",
      }),
    })
      .required()
      .messages({
        "any.required": "Guardian information is required",
      }),

    profileImage: Joi.string().uri().optional().messages({
      "string.uri": "Profile image must be a valid URL",
    }),

    isActive: Joi.string()
      .valid("active", "blocked")
      .default("active")
      .messages({
        "any.only": "Status must be either 'active' or 'blocked'",
      }),
  }); */
