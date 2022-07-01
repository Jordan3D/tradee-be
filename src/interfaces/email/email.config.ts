import { EmailType } from './email-type.enum';

export interface EmailConfig {
  sendgridApiKey: string;
  from: string;
  siteUrl: string;
  partnerSiteUrl: string;
  templateIds: {
    [Type in EmailType]: string;
  };
  contactUsTo: string;
}
