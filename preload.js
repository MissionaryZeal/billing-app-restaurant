const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    fetchCategoriesWithMenus: () =>
        ipcRenderer.invoke("fetchCategoriesWithMenus"),
});
