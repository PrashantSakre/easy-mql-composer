# Easy MQL Composer

Query Composer for EasyMQL

## Installation

### Docker

1. Pull the docker image

    ```sh
    docker pull easy-mql-composer
    ```

2. Run the container

    ```sh
    docker run -p 5000:5000 easy-mql-composer
    ```

Set `HOST` and `PORT` environment variables to override default host `0.0.0.0` and port `5000` values respectively.

### Standalone

1. Clone this repository or simply download

    ```sh
    # Clone
    git clone https://github.com/PrashantSakre/easy-mql-webtool.git

    # -- OR --
    # Download zip file from github and unzip it using the following command
    unzip <zip file path>
    ```

2. Install and run entry file

    ```sh
    cd easy-mql-webtool
    pip3 install requirements.txt
    python3 run.py
    ```

Set `HOST` and `PORT` environment variables to override default host `0.0.0.0` and port `5000` values respectively.
