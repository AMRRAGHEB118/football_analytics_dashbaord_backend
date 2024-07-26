import { Controller, Post, Body } from '@nestjs/common';
import { ContactUsService } from './contact_us.service';
import { CreateContactUsDto } from './create_contact_us.dto';
import { ContactUs } from './contact_us.schema';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  async create(
    @Body() createContactUsDto: CreateContactUsDto,
  ): Promise<ContactUs> {
    return this.contactUsService.create(createContactUsDto);
  }
}
