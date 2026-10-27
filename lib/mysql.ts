import mysql, { Pool } from 'mysql2/promise';

let pool: Pool | null = null;
let tablesInitialized = false;

export function getDBCredentials() {
  const host =
    process.env.HOSTINGER_MYSQL_HOST ||
    (process.env.MYSQL_HOST && !process.env.MYSQL_HOST.includes('127.0.0.1')
      ? process.env.MYSQL_HOST
      : 'srv1415.hstgr.io');

  const port = parseInt(
    process.env.HOSTINGER_MYSQL_PORT || process.env.MYSQL_PORT || '3306',
    10
  );

  const user =
    process.env.HOSTINGER_MYSQL_USER ||
    (process.env.MYSQL_USER && process.env.MYSQL_USER.startsWith('u762924426')
      ? process.env.MYSQL_USER
      : 'u762924426_manfresh');

  const password =
    process.env.HOSTINGER_MYSQL_PASSWORD ||
    (process.env.MYSQL_PASSWORD && process.env.MYSQL_PASSWORD !== 'root'
      ? process.env.MYSQL_PASSWORD
      : 'Zxczxczxc1@a');

  const database =
    process.env.HOSTINGER_MYSQL_DATABASE ||
    (process.env.MYSQL_DATABASE && process.env.MYSQL_DATABASE.startsWith('u762924426')
      ? process.env.MYSQL_DATABASE
      : 'u762924426_manfresh_db');

  return { host, port, user, password, database };
}

export function isMySQLConfigured(): boolean {
  const creds = getDBCredentials();
  return Boolean(creds.host && creds.user && creds.database);
}

export function getMySQLPool(): Pool | null {
  if (!pool) {
    const creds = getDBCredentials();
    pool = mysql.createPool({
      host: creds.host,
      port: creds.port,
      user: creds.user,
      password: creds.password,
      database: creds.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }

  return pool;
}

/**
 * Automatically initialize the required database tables in Hostinger MySQL
 */
export async function initMySQLTables(): Promise<boolean> {
  if (tablesInitialized) return true;
  const p = getMySQLPool();
  if (!p) return false;

  try {
    // 1. Products Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        orderIndex INT DEFAULT 0,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        vipPrice VARCHAR(50),
        regularPrice VARCHAR(50),
        imageSrc TEXT,
        thumbnails JSON,
        detailedDescription LONGTEXT,
        badge VARCHAR(100),
        rating DECIMAL(3, 1) DEFAULT 5.0,
        reviewCount VARCHAR(50),
        soldCount VARCHAR(50),
        salesBadge VARCHAR(100),
        shortDescription TEXT,
        highlights JSON,
        variants JSON,
        gifts JSON,
        cashbackText VARCHAR(255),
        warrantyText VARCHAR(255),
        videoReviews JSON,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Orders Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        customerName VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        productName VARCHAR(255) NOT NULL,
        variant VARCHAR(100),
        quantity INT DEFAULT 1,
        totalPrice VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Đang xử lý',
        paymentMethod VARCHAR(50) DEFAULT 'COD',
        notes TEXT,
        discountCode VARCHAR(50),
        discountAmount VARCHAR(50),
        createdAt VARCHAR(100),
        createdAtTimestamp BIGINT,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Media Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS media (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url LONGTEXT NOT NULL,
        type VARCHAR(50),
        mediaType VARCHAR(50),
        size INT DEFAULT 0,
        createdAt VARCHAR(100),
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    tablesInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize MySQL tables:', error);
    return false;
  }
}
