<?php declare(strict_types = 1);

function get_docs_in_directory(string $dir): array {
    $files = list_files_in_dir($dir);
    $suite = [];
    foreach ($files as $file) {
        $func_docs = get_functions_with_phpdoc($file);
        $class_doc = array( 'Class Doc' => get_class_phpdoc($file) );
        $func_docs = array_merge($class_doc, $func_docs);
        $suite[basename($file)] = $func_docs;
    }
    return $suite;
}

function list_files_in_dir(string $dir): array {
    $result = [];
    // Ensure the directory path ends with a slash
    if (substr($dir, -1) !== DIRECTORY_SEPARATOR) {
        $dir .= DIRECTORY_SEPARATOR;
    }
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    foreach ($iterator as $fileinfo) {
        if ($fileinfo->isFile()) {
            $filename = $fileinfo->getRealPath();
            // Only include files ending in Test.php
            if (!preg_match('/.*Test.php/', $filename)) {
                continue;
            }
            $result[] = $filename;
        }
    }
    return $result;
}

function get_functions_with_phpdoc(string $file): array {
    // Read the file content
    $code = file_get_contents($file);
    // Get all tokens from the code
    $tokens = token_get_all($code);

    $functions = [];
    $phpdoc = '';
    $captureNextString = false;

    // Loop through each token
    foreach ($tokens as $token) {
        if (is_array($token)) {
            if ($token[0] == T_DOC_COMMENT) {
                // Capture PHPDoc comment
                $phpdoc = $token[1];
            } elseif ($token[0] == T_FUNCTION) {
                // When we see a T_FUNCTION, the next string token is the function name
                $captureNextString = true;
            } elseif ($captureNextString && $token[0] == T_STRING) {
                // Ignore functions not starting with 'test'
                if (!preg_match('/test.*/', $token[1])) {
                    continue;
                }
                // Capture the function name and associate it with the last PHPDoc comment
                $functions[$token[1]] = clean_phpdoc($phpdoc);
                $captureNextString = false;
                $phpdoc = ''; // Reset PHPDoc after associating it with a function
            }
        }
    }

    return $functions;
}

function get_class_phpdoc(string $file): string {
    $code = file_get_contents($file);
    $tokens = token_get_all($code);

    $phpdoc = '';
    $captureNextString = false;

    $class = [];

    foreach ($tokens as $token) {
        if (!is_array($token)) {
            continue;
        }

        if ($token[0] == T_DOC_COMMENT) {
            $phpdoc = $token[1];
        } elseif ($token[0] == T_CLASS) {
            $captureNextString = true;
        } elseif ($captureNextString && $token[0] == T_STRING) {
            return clean_phpdoc($phpdoc);

            $phpdoc = '';
            $captureNextString = false;
        }
    }
    return 'No class PHPDoc found.';
}

function clean_phpdoc(string $docstring): string {
    $string = substr($docstring, 3, -2); // Strips opening/closing tags
    $trimmed = trim(preg_replace('/^\s*\*\s*?(\S|$)/m', '\1', $string));
    $clean = strstr($trimmed, PHP_EOL, true);
    return $clean ? $clean : $trimmed;
}

// Usage example:
$docs = get_docs_in_directory($argv[1]);
echo getcwd();
print_r($docs);
$csv_string = convert_doc_array_to_csv($docs);
echo $csv_string;
create_csv_file($csv_string);


function convert_doc_array_to_csv(array $docs): string {
    $lines = array();
    $lines[] = 'Test, Case, About';
    foreach ($docs as $test_name => $test_array) {
        $lines[] = convert_test_array($test_name, $test_array);
    }
    return implode(PHP_EOL, $lines) . PHP_EOL;
}

function convert_test_array(string $test_name, array $test_array): string {
    $csv_lines = array();
    foreach ($test_array as $function => $phpdoc) {
        $csv_lines[] = $test_name . ', ' . $function . ', ' . $phpdoc;
    }
    return implode(PHP_EOL, $csv_lines);
}

function create_csv_file(string $csv_string): void {
    $rows = explode(PHP_EOL, $csv_string);
    $filename = 'phpunit/docs/testcases.csv';
    $fd = fopen($filename, 'w');
    if ($fd === false) {
        die();
    }
    foreach ($rows as $row) {
        $fields = explode(', ', $row);
        fputcsv($fd, $fields);
    }
    fclose($fd);
}
