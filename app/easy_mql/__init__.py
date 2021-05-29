import logging.handlers
import os
import time


# FORMATTER
class UTCFormatter(logging.Formatter):
    default_msec_format = '%s.%03d'
    converter = time.gmtime


detailed = UTCFormatter(
    fmt="[{levelname:8}] [{processName}] [{threadName}] [{asctime} UTC] [{lineno}:{name}] [{message}]",
    style='{',
)

# HANDLERS
# console
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(detailed)
# Rotating file
LOG_DIR = os.getenv('LOG_DIR', 'app/.logs')
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE_NAME = LOG_DIR + '/easy-mql-webtool.log'
LOG_FILE_SIZE = 2097152  # 2 MiB
file_handler = logging.handlers.RotatingFileHandler(
    LOG_FILE_NAME, maxBytes=LOG_FILE_SIZE, backupCount=10
)
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(detailed)

# logger
root = logging.getLogger()
root.setLevel(logging.DEBUG)
root.addHandler(console_handler)
root.addHandler(file_handler)
