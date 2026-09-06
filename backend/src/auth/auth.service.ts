import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Er bestaat al een account met dit e-mailadres');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          mobile: dto.phone || null,
          passwordHash,
          role: dto.role,
          status: UserStatus.ACTIVE,
          emailVerifiedAt: new Date(),
        },
      });

      if (dto.role === UserRole.CONSUMER) {
        await tx.consumerProfile.create({
          data: {
            userId: newUser.id,
            displayName: dto.displayName,
            firstName: dto.firstName || null,
            lastName: dto.lastName || null,
            phone: dto.phone || null,
          },
        });
      } else if (dto.role === UserRole.BUSINESS_OWNER) {
        await tx.businessOwnerProfile.create({
          data: {
            userId: newUser.id,
            displayName: dto.displayName,
            phone: dto.phone || null,
          },
        });
      }

      return tx.user.findUnique({
        where: { id: newUser.id },
        include: {
          consumerProfile: true,
          businessOwnerProfile: true,
        },
      });
    });

    const token = this.generateJwt(user!);

    return {
      accessToken: token,
      user: this.sanitizeUser(user!),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase() },
      include: {
        consumerProfile: true,
        businessOwnerProfile: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Ongeldige inloggegevens');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Ongeldige inloggegevens');
    }

    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.DELETED) {
      throw new UnauthorizedException('Account is geschorst of gedeactiveerd');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.generateJwt(user);

    return {
      accessToken: token,
      user: this.sanitizeUser(user),
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        consumerProfile: true,
        businessOwnerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Gebruiker niet gevonden');
    }

    return this.sanitizeUser(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      // Return success to prevent email enumeration
      return { message: 'Als de e-mail bekend is bij ons, is er een herstelinstructie verzonden.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      message: 'Als de e-mail bekend is bij ons, is er een herstelinstructie verzonden.',
      demoToken: token, // Exposed for development demo convenience
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');

    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Ongeldige of verlopen reset token');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Wachtwoord succesvol bijgewerkt. Je kunt nu inloggen.' };
  }

  private generateJwt(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: any) {
    const profileId =
      user.role === UserRole.CONSUMER
        ? user.consumerProfile?.id
        : user.role === UserRole.BUSINESS_OWNER
        ? user.businessOwnerProfile?.id
        : undefined;

    const displayName =
      user.role === UserRole.CONSUMER
        ? user.consumerProfile?.displayName
        : user.role === UserRole.BUSINESS_OWNER
        ? user.businessOwnerProfile?.displayName
        : 'Super Admin';

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      displayName,
      profileId,
      createdAt: user.createdAt,
    };
  }
}
