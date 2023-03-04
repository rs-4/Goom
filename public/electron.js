const { app, BrowserWindow, protocol, ipcMain, dialog } = require("electron");
const path = require("path");
const url = require("url");

const { desktopCapturer } = require("electron");

desktopCapturer
  .getSources({ types: ["window", "screen"] })
  .then(async (sources) => {
    for (const source of sources) {
      if (source.name === "Electron") {
        mainWindow.webContents.send("SET_SOURCE", source.id);
        return;
      }
    }
  });

// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // Set the path of an additional "preload" script that can be used to
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  // Add system menu to move the window with drag
  mainWindow.on("ready-to-show", () => {
    mainWindow.webContents.on("before-input-event", (event, input) => {
      if (input.type === "keyDown" && input.key === "Escape") {
        mainWindow.blur();
      }
    });

    mainWindow.setMenu(null);

    mainWindow.webContents.executeJavaScript(`
      const { remote } = require('electron');
      const currentWindow = remote.getCurrentWindow();

      let isDragging = false;
      let mousePosition;

      const dragWindow = (e) => {
        if (isDragging) {
          let { x, y } = currentWindow.getPosition();
          currentWindow.setPosition(x + e.clientX - mousePosition.x, y + e.clientY - mousePosition.y);
        }
      }

      const stopDragging = (e) => {
        isDragging = false;
      }

      const startDragging = (e) => {
        isDragging = true;
        mousePosition = {
          x: e.clientX,
          y: e.clientY
        }
      }

      document.getElementById('title-bar').addEventListener('mousedown', startDragging);
      document.getElementById('title-bar').addEventListener('mousemove', dragWindow);
      document.getElementById('title-bar').addEventListener('mouseup', stopDragging);
    `);
  });

  ipcMain.on("open-file-dialog", (event) => {
    dialog
      .showOpenDialog(mainWindow, {
        properties: ["openFile"],
        filters: [{ name: "Sound", extensions: ["mp3"] }],
      })
      .then((result) => {
        // se lance quand on a selectionner le fichier
        event.reply("selected-file", result.filePaths[0]); // envoie le chemin du fichier selectionner
      })
      .catch((err) => {
        console.log(err);
        dialog.showErrorBox("Error", "Something went wrong");
      });
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

const localFileProtocol = () => {
  const protocolName = "safe-file";
  // https://www.electronjs.org/fr/docs/latest/api/protocol#protocolregisterfileprotocolscheme-handler
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, "");
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      // Handle the error as needed
      console.error(error);
    }
  });
};

function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();
  localFileProtocol();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});
