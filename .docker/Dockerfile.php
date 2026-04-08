##
# @see  https://govcms.gov.au/wiki-advanced#docker
#

ARG CLI_IMAGE
ARG GOVCMS_IMAGE_VERSION={{ GOVCMS_VERSION }}.x-latest

FROM ${CLI_IMAGE} as cli
FROM govcms/php:${GOVCMS_IMAGE_VERSION}

# Clean up base image so as not to conflict with any changes.
RUN rm -rf /app

COPY --from=cli /app /app
