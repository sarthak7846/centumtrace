import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './signup.dto';
import { OrganizationService } from 'src/organization/organization.service';
import { MembershipService } from 'src/membership/membership.service';
import { User } from '@centumtrace/db';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private organizationService: OrganizationService,
    private membershipService: MembershipService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) return user;
    }

    return null;
  }

  login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15d' }),
    };
  }

  async signup(signupDto: SignupDto) {
    const { email, name, password } = signupDto;

    try {
      const user = await this.userService.findByEmail(email);

      if (user) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.userService.createUser({
        email,
        name,
        password: hashedPassword,
      });

      // Create a new organization for user and a membership associated with that org
      const org = await this.organizationService.createOrganization(
        `${name}'s organization`,
        'New Org',
      );

      await this.membershipService.createMembership(
        newUser.id,
        org.id,
        'OWNER',
      );

      return {
        status: 'success',
        data: newUser,
        org,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
