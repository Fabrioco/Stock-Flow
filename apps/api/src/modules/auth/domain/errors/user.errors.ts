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

export class EmailAlreadyInUseError extends UserError {
  constructor(email: string){
    super(`This email: ${email} is already in use.`)
  }
}