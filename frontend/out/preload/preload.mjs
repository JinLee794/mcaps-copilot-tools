import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  auth: {
    azRefresh: () => ipcRenderer.invoke("auth:az-refresh")
  },
  copilot: {
    run: (params) => ipcRenderer.invoke("copilot:run", params),
    cancel: (runId) => ipcRenderer.invoke("copilot:cancel", { runId }),
    captureWorkflow: () => ipcRenderer.invoke("copilot:capture-workflow"),
    onEvent: (callback) => {
      const handler = (_, event) => callback(event);
      ipcRenderer.on("ag-ui:event", handler);
      return () => ipcRenderer.removeListener("ag-ui:event", handler);
    }
  },
  mcp: {
    listTools: () => ipcRenderer.invoke("mcp:list-tools"),
    onToolResult: (callback) => {
      const handler = (_, data) => callback(data);
      ipcRenderer.on("mcp:tool-result", handler);
      return () => ipcRenderer.removeListener("mcp:tool-result", handler);
    }
  },
  skills: {
    list: () => ipcRenderer.invoke("skill:list"),
    load: (skillId) => ipcRenderer.invoke("skill:load", { skillId }),
    save: (skillId, content) => ipcRenderer.invoke("skill:save", { skillId, content })
  },
  workflows: {
    list: () => ipcRenderer.invoke("workflow:list"),
    run: (workflowId, params) => ipcRenderer.invoke("workflow:run", { workflowId, params })
  },
  permission: {
    respond: (params) => ipcRenderer.invoke("permission:respond", params)
  }
});
