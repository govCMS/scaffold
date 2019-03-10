<?php

/**
 * @file
 * Alias for GovCMS prod environment only accessible within lagoon.
 *
 */

 if (getenv('LAGOON_PROJECT')) {
  $aliases["govcms-prod"] = array (
    "root" => "/app/web",
    "remote-host" => "ssh.lagoon.svc",
    "remote-user" => getenv('LAGOON_PROJECT') . "-master",
    "ssh-options" => "-q -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p 2020 -F /dev/null",
  );
 }
