/**
 * @file
 * End-to-end tests for HSK site.
 *
 * Tests are written using Cypress testing framework.
 */
const appOrToolHosted = require("./modules/app_or_tool_hosted");
const appOrTool = require("./modules/app_or_tool");
const collection = require("./modules/collection");
const embeddedListings = require("./modules/embedded_listings");
const featured = require("./modules/featured");
const foi = require("./modules/foi");
const globalNotification = require("./modules/global_notification");
const landingPage = require("./modules/landing_page");
const listingPage = require("./modules/listing_page");
const nodeNewsArticle = require("./modules/news_article");
const publication = require("./modules/publication");
const referenceParagraphs = require("./modules/search");
const search = require("./modules/search");
const standardPage = require("./modules/standard_page");
const webforms = require("./modules/webforms");
const video = require("./modules/video");

appOrToolHosted.tests(cy);
appOrTool.tests(cy);
collection.tests(cy);
standardPage.tests(cy);
landingPage.tests(cy);
listingPage.tests(cy);
embeddedListings.tests(cy);
featured.tests(cy);
nodeNewsArticle.tests(cy);
publication.tests(cy);
referenceParagraphs.tests(cy);
video.tests(cy);
foi.tests(cy);
webforms.tests(cy);
search.tests(cy);
globalNotification.tests(cy);
