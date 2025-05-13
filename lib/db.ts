import postgres from 'postgres';

// Use environment variables for configuration
const connectionString = process.env.DATABASE_URL;

// Create a new postgres client
const sql = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production'
});

// Initialization function to create tables
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        fid INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        display_name TEXT,
        pfp_url TEXT,
        wallet_address TEXT,
        first_seen TIMESTAMP DEFAULT NOW(),
        last_active TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS moments (
        id SERIAL PRIMARY KEY,
        fid INTEGER REFERENCES users(fid),
        moment_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        transaction_hash TEXT,
        contract_address TEXT,
        custom_message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        image_url TEXT,
        is_rare BOOLEAN DEFAULT FALSE,
        metadata JSONB
      )
    `;

    console.log('Database tables created successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// User operations
export async function getUserByFid(fid: number) {
  try {
    const users = await sql<any[]>`
      SELECT * FROM users WHERE fid = ${fid}
    `;
    return users[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function getUserByWallet(walletAddress: string) {
  try {
    const users = await sql<any[]>`
      SELECT * FROM users WHERE wallet_address = ${walletAddress}
    `;
    return users[0] || null;
  } catch (error) {
    console.error('Error getting user by wallet:', error);
    return null;
  }
}

export async function createUser(user: any) {
  try {
    const result = await sql`
      INSERT INTO users (
        fid, username, display_name, pfp_url, wallet_address
      ) VALUES (
        ${user.fid}, ${user.username}, ${user.displayName}, ${user.pfpUrl}, ${user.walletAddress}
      )
      ON CONFLICT (fid) DO UPDATE SET
        username = ${user.username},
        display_name = ${user.displayName},
        pfp_url = ${user.pfpUrl},
        last_active = NOW()
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function updateUserWallet(fid: number, walletAddress: string) {
  try {
    const result = await sql`
      UPDATE users SET
        wallet_address = ${walletAddress},
        last_active = NOW()
      WHERE fid = ${fid}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating user wallet:', error);
    return null;
  }
}

// Moment operations
export async function createMoment(moment: any) {
  try {
    const result = await sql`
      INSERT INTO moments (
        fid, moment_type, title, description, transaction_hash, 
        contract_address, custom_message, image_url, is_rare, metadata
      ) VALUES (
        ${moment.fid}, ${moment.momentType}, ${moment.title}, ${moment.description}, 
        ${moment.transactionHash}, ${moment.contractAddress}, ${moment.customMessage},
        ${moment.imageUrl}, ${moment.isRare}, ${moment.metadata}
      )
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating moment:', error);
    return null;
  }
}

export async function getMomentById(id: number) {
  try {
    const moments = await sql<any[]>`
      SELECT m.*, u.username, u.display_name, u.pfp_url
      FROM moments m
      JOIN users u ON m.fid = u.fid
      WHERE m.id = ${id}
    `;
    return moments[0] || null;
  } catch (error) {
    console.error('Error getting moment:', error);
    return null;
  }
}

export async function getUserMoments(fid: number, limit = 10, offset = 0) {
  try {
    return await sql<any[]>`
      SELECT m.*, u.username, u.display_name, u.pfp_url
      FROM moments m
      JOIN users u ON m.fid = u.fid
      WHERE m.fid = ${fid}
      ORDER BY m.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } catch (error) {
    console.error('Error getting user moments:', error);
    return [];
  }
}

export async function getFriendMoments(fid: number, friendFids: number[], limit = 10, offset = 0) {
  try {
    if (!friendFids.length) return [];
    
    return await sql<any[]>`
      SELECT m.*, u.username, u.display_name, u.pfp_url
      FROM moments m
      JOIN users u ON m.fid = u.fid
      WHERE m.fid = ANY(${friendFids})
      ORDER BY m.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } catch (error) {
    console.error('Error getting friend moments:', error);
    return [];
  }
}

export async function updateMomentCustomMessage(id: number, customMessage: string) {
  try {
    const result = await sql`
      UPDATE moments SET
        custom_message = ${customMessage}
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating moment message:', error);
    return null;
  }
}

export async function checkFirstInteraction(fid: number, contractAddress: string) {
  try {
    const count = await sql<[{count: number}]>`
      SELECT COUNT(*) as count FROM moments
      WHERE fid = ${fid} AND contract_address = ${contractAddress}
    `;
    return count[0].count === 0;
  } catch (error) {
    console.error('Error checking first interaction:', error);
    return true; // default to true if error, to avoid duplicates
  }
}

// Export the sql client for custom queries
export { sql };