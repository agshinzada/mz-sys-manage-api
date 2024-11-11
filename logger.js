const winston = require("winston");

// Loglama düzeyleri
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Renkler
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
};

// Winston logger oluşturma
const logger = winston.createLogger({
  levels: levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: "combined.log" }), // Dosyaya loglama
  ],
});

// Renklerin tanımlanması
winston.addColors(colors);

module.exports = logger;
