import logging

level = logging.INFO
fh = logging.FileHandler('output.log')
fh.setLevel(level)
logger = logging.getLogger('log_collector_logger')
logger.setLevel(level)
logger.addHandler(fh)
