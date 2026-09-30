export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}

export class InvalidUserError extends UserError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserError';
  }
}

export class UserNotFound extends UserError {
  constructor() {
    super('User not found');
    this.name = 'NotFound';
  }
}

export class CredentialsIncorrect extends UserError {
  constructor() {
    super('Credentials are incorrect');
    this.name = 'CredentialsIncorrect'
  }
}

export class EmailAlreadyInUseError extends UserError {
  constructor(email: string) {
    super(`This email: ${email} is already in use.`);
    this.name = 'EmailAlreadyInUse';
  }
}
