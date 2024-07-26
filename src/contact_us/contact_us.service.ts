import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactUs, ContactUsDocument } from './contact_us.schema';
import { CreateContactUsDto } from './create_contact_us.dto';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs.name)
    private contactUsModel: Model<ContactUsDocument>,
  ) {}

  async create(createContactUsDto: CreateContactUsDto): Promise<ContactUs> {
    const createdContactUs = new this.contactUsModel(createContactUsDto);
    return createdContactUs.save();
  }
}
