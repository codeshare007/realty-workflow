using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Abp;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Net.Mail;
using Realty.Listings;
using Realty.MultiTenancy;
using Realty.Net.Emailing;
using Realty.Url;

namespace Realty.Leads
{
    public class RecommendedListingEmailService : EmailServiceBase, IRecommendedListingEmailService, ITransientDependency
    {
        private readonly IWebUrlService _webUrlService;

        public RecommendedListingEmailService(
            IEmailTemplateProvider emailTemplateProvider,
            IEmailSender emailSender,
            IRepository<Tenant> tenantRepository,
            ICurrentUnitOfWorkProvider unitOfWorkProvider, 
            IWebUrlService webUrlService):base(emailTemplateProvider, emailSender, tenantRepository, unitOfWorkProvider)
        {
            _webUrlService = webUrlService;
        }

        public async Task SendRecommendedListingsAsync(Lead lead, string mainEmail, string[] ccEmails, string subject, string body)
        {
            Check.NotNull(lead, nameof(lead));
            Check.NotNull(mainEmail, nameof(mainEmail));
            Check.NotNull(lead.Agent, nameof(lead.Agent));

            if (lead.Agent.EmailAddress.IsNullOrEmpty())
                throw new Exception("Agent email should be set in order to sent recommended listing email.");

            //var link = GetSigningUrl(signing);
            
            var emailTemplate = GetTitleAndSubTitle(lead.TenantId, L("EmailRecommendedListings_Title"), L("EmailRecommendedListings_SubTitle"));
            var mailMessage = new StringBuilder();


            mailMessage.Append(@"<div><table width='100%'>
                                <tbody><tr>
                                    <td width='600' align='center'>
                                        <table cellpadding='0' cellspacing='0' width='600' style=''>
                                            <tbody>
                                                <tr>
                                                    <td>");
            mailMessage.Append(body);
            mailMessage.Append(@"
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table width='100%' style='background-color: #f8fbff; margin-top: 35px; margin-bottom: 35px; padding: 15px 15px;'>
                            <tbody>
                                <tr>
                                    <td width='600' align='center'>
                                        <table cellpadding='0' cellspacing='0'>
                                            <tbody>
                                                <tr>
                                                    <td class='m_7580185837922795915column m_7580185837922795915mobile_fulwidth' width='290' style='width: 290px;' valign='top'>
                                                        <img src='https://ci5.googleusercontent.com/proxy/VLhYL3RbEG2bu798n13MHJx5PFdMcxcn05HnWZHcS7l5d3dr_u-QgAM2ilkWHvV1qkb1Ur13qeLnYlHGgA5fNKxbuQ=s0-d-e1-ft#https://ygl-logo.s3.amazonaws.com/AC-000-066.jpg'
                                                            alt='Harvard Ave Realty'
                                                            width='150'
                                                            style='width: 150px;'
                                                            tabindex='0'
                                                        />
                                                    </td>
                                                    <td width='20' style='width: 20px;' valign='top'>&nbsp;</td>
                                                    <td width='290' style='width: 290px;' valign='top'>
                                                        <table width='100%'>
                                                            <tbody>
                                                                <tr>
                                                                    <td style='width: 50%; text-align: center;'>
                                                                        <div style='width: 60px; height: 60px; margin-left: auto; margin-right: auto; border-radius: 30px; overflow: hidden !important;'>
                                                                            <img
                                                                                src='https://ci3.googleusercontent.com/proxy/UF8ebITZXMQ2g-l3vpqKbXXtgg_3rh4hcxz2-XsEoT5D1R1pEaJvYK1ZS7VDsJZISbTcucXvdvRd2FNvL7-KoQUauTc=s0-d-e1-ft#https://s3.amazonaws.com/ygl-agent-avatar/579.jpg'
                                                                                border='0'
                                                                                width='60'
                                                                                height='60'
                                                                                alt=''
                                                                                style='width: 60px; height: 60px; display: block;'
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td>&nbsp;</td>
                                                                    <td style='width: 50%;'>
                                                                        <div>");

            mailMessage.Append($"{lead.Agent.FullName}<br/>{lead.Agent.PhoneNumber}<br/><a href='mailto:{lead.Agent.EmailAddress}' target='_blank'>{lead.Agent.EmailAddress}</a>");
            mailMessage.Append(@"                                       </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='3' height='20' style='height: 20px;'></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table cellpadding='0' cellspacing='0'>
                                            <tbody>");
            
            var recommendedListings = lead.RecommendedListings.ToList();
            for (var i = 0; i < recommendedListings.Count; i++)
            {
                mailMessage.Append("<tr>");
                mailMessage.Append($"<td width='290' valign='top'>{GetRecommendedListingHtml(recommendedListings[i])}</td>");
                mailMessage.Append($"<td width='20' valign='top'>&nbsp;</td>");

                if (i + 1 < recommendedListings.Count)
                {
                    mailMessage.Append($"<td width='290' valign='top'>{GetRecommendedListingHtml(recommendedListings[i+1])}</td>");
                    i++;
                }
                mailMessage.Append("</tr>");
            }
            mailMessage.Append(@"               <tr>
                                                    <td colspan='3' height='20' style='height: 20px;'></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table width='100%' style='margin-top: 80px; background-color: #ffffff;'>
                            <tbody>
                                <tr></tr>
                            </tbody>
                        </table>
                    </div>");

            await ReplaceBodyAndSend(
                emailAddress: mainEmail,
                replyTo: lead.Agent.EmailAddress,
                ccEmails,
                subject: !subject .IsNullOrEmpty() ? subject : L("RecommendedListings_Subject"),
                emailTemplate: emailTemplate,
                mailMessage: mailMessage);
        }

        public async Task NotifyAgentAboutRecommendedListingAsync(Lead lead, RecommendedListing listing)
        {
            Check.NotNull(lead, nameof(lead));
            Check.NotNull(lead.Agent, nameof(lead.Agent));

            var emailTemplate = GetTitleAndSubTitle(lead.TenantId, L("EmailRecommendedListingInterest_Title"), L("EmailRecommendedListingInterest_SubTitle"));
            var mailMessage = new StringBuilder();

            var link = GetLeadUrl(lead);
            mailMessage.AppendLine($"Hello {lead.Agent.FullName},<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine($"The lead <b>{lead.LeadContacts.FirstOrDefault().FullName}</b> has interested in one of the recommented listing: <br/>{ listing.Listing.FullAddress }.<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<a style=\"" + EmailButtonStyle + "\" bg-color=\"" + EmailButtonColor + "\" href=\"" + link + "\">" + L("EmailRecommendedListingInterest_ViewBtn") + "</a>");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<span style=\"font-size: 9pt;\">" + L("EmailMessage_CopyTheLinkBelowToYourBrowser") + "</span><br />");
            mailMessage.AppendLine("<span style=\"font-size: 8pt;\">" + link + "</span>");
            mailMessage.AppendLine("<br />");

            await ReplaceBodyAndSend(
                emailAddress: lead.Agent.EmailAddress,
                null,
                null,
                subject: L("EmailRecommendedListingInterest_Subject"),
                emailTemplate: emailTemplate,
                mailMessage: mailMessage);
        }

        private string GetListingUrl(RecommendedListing listing)
        {
            return _webUrlService.GetSiteRootAddress().EnsureEndsWith('/') + $"listing/{listing.Id}";
        }

        private string GetLeadUrl(Lead lead)
        {
            return _webUrlService.GetSiteRootAddress().EnsureEndsWith('/') + $"app/admin/lead/{lead.Id}";
        }

        private string GetListingPhoto(RecommendedListing item)
        {
            return _webUrlService.GetServerRootAddress().EnsureEndsWith('/') + $"Listing/GetFirstPhoto?listingId={item.ListingId}";
            //return item.Listing.Photo != null && item.Listing.Photo.Count > 0 ? item.Listing.Photo[0] : string.Empty;
        }

        private string GetRecommendedListingHtml(RecommendedListing item)
        {
            return @"<table style='background-color: #ffffff; border-width: 1px; border-style: solid; border-color: #d4d4d4;'>
                            <tbody>
                                <tr>
                                    <td>
                                        <a  " +
                $"href='{GetListingUrl(item)}'" +
                @"target='_blank'><img " +
                $" src='{GetListingPhoto(item)}'" +
                $"    alt='{item.Listing.StreetName}, {item.Listing.City}'" +
                @"    width ='300'
                                                height='200'
                                                style='width: 100%; height: 100%; max-width: 300px; max-height: 200px; display: block;'
                                            />
                                        </a>
                                        <table width='270' style='width: 270px; margin-left: 10px; margin-right: 10px; margin-top: 15px; margin-bottom: 15px;'>
                                            <tbody>
                                                <tr>" +
                $"<td width='25%' style='font-size: 16px;'><strong>{item.Listing.Price}</strong></td>" +
                $"<td width='25%'>{item.Listing.Beds}</td>" +
                $"<td width='25%'>{item.Listing.Baths}</td>" +
                $"<td width='25%'>{item.Listing.AvailableDate?.ToString()}</td>" +
                @"</tr>
                                                <tr>
                                                    <td colspan='4' style='padding-top: 10px;'> " +
                $"<a href ='{GetListingUrl(item)}' target='_blank'> {item.Listing.StreetName}, {item.Listing.City}</a>" +
                @"</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>";
        }
    }
}
