# DGAC NM B2B JavaScript client example

This repository contains a simple example project to demonstrate the setup and usage of the [DGAC NM B2B JavaScript client](https://github.com/DGAC/nmb2b-client-js).


# Quickstart
```shell
# Clone this repository
$ git clone git@github.com:DGAC/nmb2b-client-js-example.git b2b-client-example

# Install dependencies
$ cd b2b-client-example
$ pnpm install

# Configure your B2B certificate via .env file
$ rm .env
$ echo 'B2B_FLAVOUR=PREOPS' >> .env
$ echo 'B2B_CERT_FORMAT=pfx' >> .env
$ echo 'B2B_CERT=/path/to/your/b2b/certificate.p12' >> .env
$ echo 'B2B_CERT_PASSPHRASE=MyPassPhrase' >> .env

# Start the example
$ pnpm start
```
