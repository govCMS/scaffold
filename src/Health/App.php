<?php

namespace Health;

use Composer\Installer\PackageEvent;
use Composer\Package\CompletePackage;
use DOMDocument;

/**
 * Utility for integration Health apps into the Health website theme.
 */
class App {

  /**
   * List of support app types.
   *
   * @var array
   */
  protected static $supportedAppTypes = [
    'health-app-angular',
    'health-app-default',
    'health-app-react',
  ];

  /**
   * Package event.
   *
   * @var Composer\Installer\PackageEvent
   */
  protected $packageEvent;

  /**
   * Package name
   *
   * @var string
   */
  protected $packageName;

  /**
   * Path to installed app.
   *
   * @var string
   */
  protected $appPath;

  /**
   * App type.
   *
   * @var string
   */
  protected $appType;

  /**
   * Instance of class responsible for handling terminal input and output.
   *
   * @var Composer\IO\IOInterface
   */
  protected $consoleIO;

  /**
   * Defines if the app should be a production or development build.
   *
   * @var bool
   */
  protected $isProductionBuild;

  /**
   * Define if CSS files should be removed from app build files.
   *
   * @var bool
   */
  protected $removeCss;

  /**
   * Constructor.
   */
  public function __construct(PackageEvent $packageEvent) {
    $this->packageEvent = $packageEvent;

    // Set installation path of the app.
    $package = $packageEvent->getOperation()->getPackage();
    $installationManager = $packageEvent->getComposer()->getInstallationManager();
    $relativeAppPath = $installationManager->getInstallPath($package);
    $projectPath = dirname($this->packageEvent->getComposer()->getConfig()->get('vendor-dir'));
    $this->appPath = $projectPath . '/' . $relativeAppPath;

    // Set app type.
    $this->appType = $package->getType();

    // Set terminal I/O interface.
    $this->consoleIO = $packageEvent->getIO();

    // Get package name.
    $path_components = explode('/', rtrim($relativeAppPath, '/'));
    $this->packageName = end($path_components);
  }

  /**
   * Execute a shell command.
   *
   * @param string $command
   *   Command to execute.
   * @param string $success_message
   *   Message to display in console if command executed successfully. Default
   *   value is '[DONE]'.
   */
  protected function executeCommand(string $command, string $success_message = '[DONE]') {
    exec($command, $output, $exit_code);
    if ($exit_code == 0) {
      $this->consoleIO->write($success_message);
    }
    else {
      $this->consoleIO->writeError("[WARNING] Something went wrong whilst running `$command`. Exit code: $exit_code");
    }
  }

  /**
   * Generic clean up tasks which should be applied to application.
   */
  protected function postIntegrationCleanup() {
    // Convert Git repo to non-Git controlled file directory. This is required
    // to be able to commit the app files to Health project codebase.
    $git_related_files_folders = [
      '.git',
      '.gitignore',
    ];
    $this->consoleIO->write("Checking if project uses Git... ");
    foreach ($git_related_files_folders as $file) {
      $git_file_path = $this->appPath . $file;
      if (file_exists($git_file_path)) {
        $command = 'cd ' . escapeshellcmd($this->appPath) . ' && rm -Rf ' . escapeshellcmd($git_file_path);
        $this->executeCommand($command, "Removing " . $git_file_path);
      }
    }
    $this->consoleIO->write("[DONE]");
  }

  /**
   * Get list of supported app package types.
   *
   * @return array
   *   List of supported app package types.
   *
   * @access public
   */
  public static function getSupportedAppTypes() {
    return static::$supportedAppTypes;
  }

  /**
   * Check if package type is one of the supported app types.
   *
   * @param Composer\Package\CompletePackage $package
   *   Instance of CompletePackage class.
   *
   * @return bool
   *   Whether or not the current package type is an instance of a supported
   *   app type.
   *
   * @access public
   */
  public static function isApp(CompletePackage $package) {
    $appTypes = static::getSupportedAppTypes();
    if (in_array($package->getType(), $appTypes)) {
      return TRUE;
    }
    return FALSE;
  }

  /**
   * Process app.
   *
   * Determines the type of app and processes according to that type.
   *
   * @access protected
   */
  protected function processApp() {
    // Confirm if app is a production or development build.
    $isProductionBuild = $this->consoleIO->askConfirmation("Is this a production build? (Y, n): ", TRUE);
    $this->isProductionBuild = (empty($isProductionBuild)) ? FALSE : TRUE;

    // Check if recognised app and process according to type.
    switch ($this->appType) {
      case 'health-app-angular':
        $this->processAngularApp();
        break;

      case 'health-app-react':
        $this->processReactApp();
        break;

      case 'health-app-default':
        // For projects not connected with a specific framework.
        $this->processDefaultApp();
        break;
    }

    // Generic postintegration cleanup tasks.
    $this->postIntegrationCleanup();

    // Display the location of the newly installed app.
    $this->consoleIO->write("App has been installed in following location: $this->appPath");
  }

  /**
   * Post install/update processing for Angular apps.
   */
  protected function processAngularApp() {
    // @todo Add processing specific to Angular based apps.
  }

  protected function processDefaultApp() {
    // Install dependencies.
    $this->consoleIO->write("Checking for NPM dependencies... ");

    if (file_exists($this->appPath . 'package.json')) {
      $installNpmDependencies = $this->consoleIO->askConfirmation("A package.json file has been detected. Would you like to install any NPM dependencies? (Y, n): ", TRUE);
      if ($installNpmDependencies) {
        $this->consoleIO->write("Installing dependencies... ");
        $command = 'cd ' . escapeshellcmd($this->appPath) . ' && npm install';
        $this->executeCommand($command);
      }
      else {
        $this->consoleIO->write("Skipping installation of any NPM dependencies.");
      }
    }
  }

  /**
   * Post install/update processing for Angular apps.
   */
  protected function processReactApp() {
    $removeCss = $this->consoleIO->askConfirmation("Remove static CSS links from project? (y, N): ", FALSE);
    $this->removeCss = (empty($removeCss)) ? FALSE : TRUE;

    // Add relevant environment variables.
    $this->setReactEnvironmentalVariables();

    // Install dependencies.
    if (file_exists($this->appPath . 'package.json')) {
      $this->consoleIO->write("Installing dependencies... ");
      $command = 'cd ' . escapeshellcmd($this->appPath) . ' && npm install';
      $this->executeCommand($command);
    }

    // Build app.
    $this->consoleIO->write("Building React project... ");
    if (file_exists($this->appPath . '.env.local')) {
      $command = 'cd ' . escapeshellcmd($this->appPath) . ' && npm run build';
      $this->executeCommand($command);
    }

    // Remove source files.
    if ($this->isProductionBuild && file_exists($this->appPath . "src")) {
      $this->consoleIO->write("Remove React project source files... ", FALSE);
      $command = 'cd ' . escapeshellcmd($this->appPath) . ' && rm -Rf ./src';
      $this->executeCommand($command);
    }
    else {
      $this->consoleIO->write("Non-production build. React project source files have been retained.");
    }

    // Remove static assets.
    $this->processAppAssets();
  }

  /**
   * Package post install handler.
   *
   * @param Composer\Installer\PackageEvent $event
   *   Instance of PackageEvent class.
   */
  public static function postPackageInstall(PackageEvent $event) {
    $package = $event->getOperation()->getPackage();
    if (static::isApp($package)) {
      $app = new App($event);
      $app->processApp();
    }
  }

  /**
   * Remove static assets from relevant build files.
   *
   * Process relevant file to remove links to static assess which are not
   * required. For example, the app should use the Health Design System CSS
   * assets from the main site and not it's own compiled version.
   */
  protected function processAppAssets() {
    switch ($this->appType) {
      case 'health-app-angular':
        break;

      case 'health-app-react':
        // Remove <link> elements referring to CSS assets. These are not
        // required add app should use the main site's CSS.
        if ($this->removeCss) {
          $indexFilePath = $this->appPath . 'build/index.html';
          $static_css_links = [];
          if (file_exists($indexFilePath)) {
            $this->consoleIO->write('Removing <link> elements form index.html file... ', FALSE);
            $dom = new DOMDocument();
            if (@$dom->loadHTMLFile($indexFilePath)) {
              $links = $dom->getElementsByTagName('link');
              foreach ($links as $link) {
                $regex_pattern = '/\/static\/css/';
                if (preg_match($regex_pattern, $link->getAttribute('href'))) {
                  array_unshift($static_css_links, $link);
                }
              }
              foreach ($static_css_links as $link) {
                $link->parentNode->removeChild($link);
              }
              // Write modified markup back to index.html file.
              if (!empty(file_put_contents($indexFilePath, $dom->saveHTML()))) {
                $this->consoleIO->write("[DONE]");
              }
              else {
                $this->consoleIO->write("[FAILED]\nError occurred when trying to write modified markup to index.html file.");
              }
            }
            else {
              $this->consoleIO->write("[FAILED]\nError occurred while reading index.html file.");
            }
          }
        }
        break;
    }
  }

  /**
   * Create environmental variables file for React project.
   */
  protected function setReactEnvironmentalVariables() {
    $variables = [];
    $output = '# Local environmental variables used by Reach. These are generated automattically by Composer.' . PHP_EOL;
    $localEnvFilePath = $this->appPath . '.env.local';

    if ($this->isProductionBuild) {
      // Set environmental variables for production build.
      $variables['REACT_APP_PATH'] = '/themes/custom/health/apps/' . $this->packageName . '/build';
      $variables['PUBLIC_URL'] = '/themes/custom/health/apps/' . $this->packageName . '/build';
      $variables['REACT_APP_PRODUCTION'] = 1;
    }
    else {
      // Set environmental variables for development build.
      $variables['REACT_APP_PATH'] = '';
      $variables['REACT_APP_PRODUCTION'] = 0;
    }
    foreach ($variables as $key => $value) {
      $output .= $key . '=' . $value . PHP_EOL;
    }
    try {
      if (!empty($variables) && !file_put_contents($localEnvFilePath, $output)) {
        throw new Exception('Error creating .env.local file');
      }
    }
    catch (Exception $e) {
      $this->consoleIO->write($e->getMessage());
    }
  }

}
