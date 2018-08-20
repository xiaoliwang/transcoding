const logger = require("../lib/Logger");

/**
 *  配置文件 config/system.js 中：
 *  ENV 如果为 dev，则日志打印在控制台。会打印所有类型的日志。
 *  ENV 如果为 prod, 则日志打印在 LOG_PATH 下对应的日志文件中。
 *    只存储 info 等级以上的日志
 *    其中 info 和 warn 都在 info.log 文件中
 *    其中 error 在 error.log 文件中
 */

logger.error("error log demo");
logger.warn("warn log demo");
logger.info("info log demo");