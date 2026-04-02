/**
 * MCP (Model Context Protocol) Integration
 * Primarily open-source MCP servers for full connectivity
 */

export interface MCPServer {
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  type: 'stdio' | 'sse' | 'http';
  enabled: boolean;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  server: string;
}

export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType?: string;
}

// Open-source MCP Servers
export const OPEN_SOURCE_MCP_SERVERS: Record<string, MCPServer> = {
  // Filesystem - Open source MCP server for file operations
  filesystem: {
    name: 'filesystem',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '.'],
    env: {},
    type: 'stdio',
    enabled: true
  },

  // Git - Open source MCP server for Git operations
  git: {
    name: 'git',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-git'],
    env: {},
    type: 'stdio',
    enabled: true
  },

  // GitHub - Open source MCP server
  github: {
    name: 'github',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: '${GITHUB_TOKEN}'
    },
    type: 'stdio',
    enabled: true
  },

  // PostgreSQL - Open source database MCP server
  postgres: {
    name: 'postgres',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres', 'postgresql://localhost:5432'],
    env: {},
    type: 'stdio',
    enabled: false
  },

  // SQLite - Open source MCP server
  sqlite: {
    name: 'sqlite',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-sqlite', './project.db'],
    env: {},
    type: 'stdio',
    enabled: false
  },

  // Brave Search - MCP search server
  braveSearch: {
    name: 'brave-search',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search'],
    env: {
      BRAVE_API_KEY: '${BRAVE_API_KEY}'
    },
    type: 'stdio',
    enabled: false
  },

  // Puppeteer - Browser automation MCP
  puppeteer: {
    name: 'puppeteer',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-puppeteer'],
    env: {},
    type: 'stdio',
    enabled: false
  },

  // Fetch - Web content MCP server
  fetch: {
    name: 'fetch',
    command: 'uvx',
    args: ['mcp-server-fetch'],
    env: {},
    type: 'stdio',
    enabled: true
  },

  // Sequential Thinking - Open source reasoning MCP
  sequentialThinking: {
    name: 'sequential-thinking',
    command: 'npx',
    args: ['-y', '@mcp/sequential-thinking'],
    env: {},
    type: 'stdio',
    enabled: true
  }
};

// Default MCP configuration
export const DEFAULT_MCP_CONFIG = {
  servers: {
    filesystem: OPEN_SOURCE_MCP_SERVERS.filesystem,
    git: OPEN_SOURCE_MCP_SERVERS.git,
    fetch: OPEN_SOURCE_MCP_SERVERS.fetch,
    sequentialThinking: OPEN_SOURCE_MCP_SERVERS.sequentialThinking
  },
  disabled: [
    'github',      // Requires token
    'postgres',    // Requires connection
    'sqlite',      // Requires database
    'braveSearch', // Requires API key
    'puppeteer'    // Heavy, enable when needed
  ]
};

// Connect MCP servers to agents
export const AGENT_MCP_MAPPING: Record<string, string[]> = {
  architect: ['filesystem', 'git', 'fetch', 'sequentialThinking', 'github', 'sqlite'],
  developer: ['filesystem', 'git', 'fetch', 'postgres', 'sqlite'],
  designer: ['filesystem', 'fetch', 'puppeteer', 'github']
};

// Format MCP config as JSON
export function formatMCPConfig(): string {
  return JSON.stringify(DEFAULT_MCP_CONFIG, null, 2);
}

// Generate config with enabled servers
export function generateMCPConfig(servers: string[]): Record<string, any> {
  const config: Record<string, any> = { mcpServers: {} };
  
  servers.forEach(serverName => {
    const server = OPEN_SOURCE_MCP_SERVERS[serverName];
    if (server && server.enabled) {
      config.mcpServers[serverName] = {
        command: server.command,
        args: server.args,
        env: server.env
      };
    }
  });
  
  return config;
}