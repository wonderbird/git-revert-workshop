# Troubleshooting the Dev Container

```text
'Invalid mount config' error when starting Dev Container using Rancher Desktop
```

If you see this error message, then move the files

- `\\wsl.localhost\Ubuntu\mnt\wslg\runtime-dir\wayland-0` and
- `\\wsl.localhost\Ubuntu\mnt\wslg\runtime-dir\wayland-0.lock`

to a backup folder.

Then retry opening the folder in a dev container.

>[!WARNING]
>
> The files tend to come back after you end the session. So keep your explorer
> window open so that you can "back them up" again ...

See also: [KeesCBakker's response to: 'Invalid mount config' error when starting Dev Container using Rancher Desktop](https://github.com/microsoft/vscode-remote-release/issues/8306#issuecomment-1938540639)

---

Up: [Back to the main page](../README.md#prerequisites-nodejs-npm)