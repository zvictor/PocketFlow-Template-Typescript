{ pkgs ? import <nixpkgs> {} }:

let
  GREEN="\\033[0;32m";
  YELLOW="\\033[0;33m";
  RED="\\033[0;31m";
  BLUE="\\033[0;34m";
  NC="\\033[0m"; # No color
in pkgs.mkShell {
  buildInputs = with pkgs; [
    distrobox
  ];

  nativeBuildInputs = with pkgs.buildPackages; [
    gcc
    ncurses
    openssh
    git
    playwright-driver.browsers
    corepack_22
    nodejs_22
    uv
  ];

  shellHook = ''
    export LD_LIBRARY_PATH=${pkgs.gcc.cc.lib}/lib''${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
    export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
    export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
  '';
}
