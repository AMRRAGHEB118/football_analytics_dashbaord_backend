import { Injectable } from '@nestjs/common';
import { UserData } from './auth.controller';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocment } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocment>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(input: UserData): Promise<UserDocment> {
    const result = await this.userModel.findOne({
      account: input.account,
      password: input.password,
    });
    return result;
  }

  async signIn(input: UserData): Promise<string | null> {
    const user = await this.validate(input);
    if (!user) return null;
    const tokenPayload = {
      role: 'admin',
      account: input.account,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload);
    return accessToken;
  }

  async checkAdminAccount(): Promise<null> {
    const account = this.configService.get<string>('ADMIN_ACCOUNT');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    const result = await this.userModel.findOne({ account });
    if (!result) {
      this.userModel.create({
        account,
        password,
      });
    }
    return null;
  }
}
