import { randomUUID } from 'crypto';
import { InvalidUserError } from '../errors/user.errors.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

export class User {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {}

  static create(props: CreateUserProps): User {
    const name = props.name.trim();
    const email = props.email.trim().toLowerCase();

    if (name.length < 2) {
      throw new InvalidUserError('Name must be at least 2 characters');
    }
    if (!EMAIL_PATTERN.test(email)) {
      throw new InvalidUserError('Invalid email format');
    }

    return new User(randomUUID(), name, email, props.password);
  }

  static restore(props: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
  }): User {
    return new User(props.id, props.name, props.email, props.passwordHash);
  }
}
