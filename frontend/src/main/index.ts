// Electron main process entry — app lifecycle + window management (§11)
import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { registerIpcHandlers } from './ipc/copilot-handlers';
import { McpRegistry } from './ipc/mcp-registry';
import { SkillsLoader } from './ipc/skills-loader';

let mainWindow: BrowserWindow | null = null;
let mcpRegistry: McpRegistry;
let skillsLoader: SkillsLoader;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Copilot Sales Assistant',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: join(__dirname, '../preload/preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // In dev, load from Vite dev server; in prod, load built HTML
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  // Initialize MCP registry from .vscode/mcp.json
  mcpRegistry = new McpRegistry();
  await mcpRegistry.load();

  // Initialize skills loader from .github/skills/
  skillsLoader = new SkillsLoader();
  await skillsLoader.load();

  // Register all IPC handlers
  registerIpcHandlers(mcpRegistry, skillsLoader);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

export { mainWindow, mcpRegistry, skillsLoader };
