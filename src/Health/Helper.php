<?php

namespace Health;

use Composer\Installer\PackageEvent;

/**
 * Utility for integration Health apps into the Health website theme.
 */
class Helper {

  /**
   * Base path of the project.
   *
   * @var string
   */
  protected $basePath;

  /**
   * Package event.
   *
   * @var Composer\Installer\PackageEvent
   */
  protected $packageEvent;

  /**
   * Path to installed package.
   *
   * @var string
   */
  protected $packagePath;

  /**
   * Package type.
   *
   * @var string
   */
  protected $packageType;

  /**
   * Instance of class responsible for handling terminal input and output.
   *
   * @var Composer\IO\IOInterface
   */
  protected $consoleIO;

  /**
   * Constructor.
   */
  public function __construct(PackageEvent $packageEvent) {
    $this->packageEvent = $packageEvent;

    // Set installation path of the app.
    $package = $packageEvent->getOperation()->getPackage();
    $installationManager = $packageEvent->getComposer()->getInstallationManager();
    $relativePackagePath = $installationManager->getInstallPath($package);
    $basePath = dirname($this->packageEvent->getComposer()->getConfig()->get('vendor-dir'));
    $this->basePath = $basePath;
    $this->packagePath = $basePath . '/' . $relativePackagePath;

    // Set app type.
    $this->packageType = $package->getType();

    // Set terminal I/O interface.
    $this->consoleIO = $packageEvent->getIO();
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
   * Package post install handler.
   *
   * @param Composer\Installer\PackageEvent $packageEvent
   *   Instance of PackageEvent class.
   */
  public static function postPackageInstall(PackageEvent $packageEvent) {
    $package = $packageEvent->getOperation()->getPackage();
    $packageTypes = [
      'health-theme',
    ];

    if (in_array($package->getType(), $packageTypes)) {
      // Remove Git related files and folder.
      $helper = new Helper($packageEvent);
      $helper->processInstalledPackageFiles();
    }
  }

  /**
   * Post installation processing of packages.
   */
  protected function processInstalledPackageFiles() {
    // Convert Git repo to non-Git controlled file directory. This is required
    // to be able to commit the app files to Health project codebase.
    $git_related_files_folders = [
      '.git',
      '.gitignore',
    ];
    $this->consoleIO->write("\nChecking if installed package is a Git repository... ");
    foreach ($git_related_files_folders as $file) {
      $git_file_path = $this->packagePath . $file;
      if (file_exists($git_file_path)) {
        $command = 'cd ' . escapeshellcmd($this->packagePath) . ' && rm -Rf ' . escapeshellcmd($git_file_path);
        $this->executeCommand($command, "Removing " . $git_file_path);
      }
    }
    $this->consoleIO->write("[DONE]\n");
  }

}
