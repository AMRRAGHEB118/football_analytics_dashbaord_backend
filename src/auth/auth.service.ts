import { Injectable } from '@nestjs/common';
import { UserData } from './auth.controller';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocment } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocment>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private async getSalt() {
    return bcrypt.genSalt();
  }

  async validate(input: UserData): Promise<UserDocment> | null {
    const result = await this.userModel.findOne({
      account: input.account,
    });
    const isMatch = await bcrypt.compare(input.password, result.password);
    return isMatch ? result : null;
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
    let password = this.configService.get<string>('ADMIN_PASSWORD');
    password = await this.hash_password(password);
    const result = await this.userModel.findOne({ account });
    if (!result) {
      this.userModel.create({
        account,
        password,
      });
    }
    return null;
  }

  private async hash_password(password: string): Promise<string> {
    const salt = await this.getSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash
  }
}
