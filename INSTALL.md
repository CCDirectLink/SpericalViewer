# Requirements #

-   Electron (1.4.12 and later)
-   Node.js & npm (abi 51 recommended)


# Dependencies #

-   unzip2 (0.2.5 and later; for extracting the gamedata out of the linux and windows version)
-   lwip (0.0.9; for extraction icons and image parts out of the media data)


# Dev Dependencies #

-   electron-rebuild (1.4.0 and later)
-   electron-prebuilt (1.4.12 and later)
-   electron-packager (4.2.0 and later)
-   electron-builder (10.8.1 and later)


# Build instructions #

1.  Install Node.js and Electron
2.  Use the terminal and Navigate to the project directory
3.  Use `npm install` to install all required dependencies
4.  Use `npm run fixnative` (linux, mac) or `npm run fixnative:win` (windows) to fix the connection between `lwip` and `electron`
5.  Run genVersion (.bat if you use Windows or the file without extension on Linux and Mac OS)
6.  Test the application with `npm start` (if an abi error occur use `npm run rebuild`)
7.  Build the unpacked version with `npm run pack` or the distribution version with `npm run dist`
