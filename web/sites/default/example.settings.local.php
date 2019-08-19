<?php
/**
 * @file
 * Local settings file example.
 *
 * This file will not be included and is just an example file. Copy this to
 * settings.local.php to enable.
 */

// Disable render caches, necessary for twig files to be reloaded on every page view
$settings['cache']['bins']['render'] = 'cache.backend.null';
$settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';
