

var EMAIL_TEMPLATE_DOC_URL = 'https://docs.google.com/document/d/1tmWywPkLD0JBRsjai55q15Ez-adAh1QBm50n_yB5tz4/edit?usp=sharing';
var EMAIL_SUBJECT = 'Thank You for your interest in our event-Mastering the Maze';

/**
 * Sends a customized email for every response on a form.
 *
 * @param {Object} e - Form submit event
 */
function onFormSubmit(e) {
  var responses = e.namedValues;

  // If the question title is a label, it can be accessed as an object field.
  // If it has spaces or other characters, it can be accessed as a dictionary.
  var email1 = responses['Participant 1 Gmail'][0].trim();
  var email2 = responses['Participant 2 Gmail'][0].trim();
  var email3 = responses['Participant 3 Gmail'][0].trim();

  Logger.log('; responses=' + JSON.stringify(responses));

  var emails = [email1, email2, email3];
  for (var i = 0; i < emails.length; i++) {
    var email = emails[i];
    Logger.log('Sending email to: ' + email);

    MailApp.sendEmail({
      to: email,
      subject: EMAIL_SUBJECT,
      htmlBody: createEmailBody(),
    });
  // Append the status on the spreadsheet to the responses' row.
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveRange().getRow();
  var column = e.values.length + 1;
  sheet.getRange(row, column).setValue('Email Sent');
}

/**
 * Creates email body and includes the links based on topic.
 *
 * @param {string} name - The recipient's name.
 * @param {string[]} topics - List of topics to include in the email body.
 * @return {string} - The email body as an HTML string.
 */
function createEmailBody() {
  // Make sure to update the emailTemplateDocId at the top.
  var docId = DocumentApp.openByUrl(EMAIL_TEMPLATE_DOC_URL).getId();
  var emailBody = docToHtml(docId);
  return emailBody;
}

/**
 * Downloads a Google Doc as an HTML string.
 *
 * @param {string} docId - The ID of a Google Doc to fetch content from.
 * @return {string} The Google Doc rendered as an HTML string.
 */
function docToHtml(docId) {
  // Downloads a Google Doc as an HTML string.
  var url = 'https://docs.google.com/feeds/download/documents/export/Export?id=' +
            docId + '&exportFormat=html';
  var param = {
    method: 'get',
    headers: {'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
}