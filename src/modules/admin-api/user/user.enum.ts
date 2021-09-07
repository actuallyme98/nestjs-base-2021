export enum UserSortByEnums {
  CREATED_AT = 'createdAt',
}

export enum UserValidatorEnums {
  REQUIRED_MESSAGE = 'Required',
  USERNAME_MAXLENGTH_MESSAGE = 'Username exceeds 60 characters',
  PASSWORD_MINLENGTH_MESSAGE = 'Password less than 8 characters',
  PASSWORD_MAXLENGTH_MESSAGE = 'Password exceeds 60 characters',
  FULLNAME_MAXLENGTH_MESSAGE = 'Fullname exceeds 180 characters',
  PHONE_MAXLENGTH_MESSAGE = 'Phone exceeds 15 characters',
}

export enum UserErrorEnums {
  NOT_EXIST = 'User does not exist',
  ALREADY_EXIST = 'User already exists',
  DONT_HAVE_PERMISSION = 'The user does not have permission to perform this action',
  CANNOT_DELETE_YOURSELF = 'Cannot delete yourself',
}
