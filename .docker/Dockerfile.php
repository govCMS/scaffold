##
# @see  https://govcms.gov.au/wiki-advanced#docker
#

ARG CLI_IMAGE
ARG GOVCMS_IMAGE_VERSION={{ GOVCMS_VERSION }}.x-latest

FROM ${CLI_IMAGE} as cli
FROM govcms/php:${GOVCMS_IMAGE_VERSION}

COPY --from=cli /app /app
