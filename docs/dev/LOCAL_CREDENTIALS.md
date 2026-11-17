# Local credentials and configuration

## Separate local folder

The app's local credential/configuration directory is outside the repository:

- Windows: `%LOCALAPPDATA%\SMKD\credentials` (normally
  `%USERPROFILE%\AppData\Local\SMKD\credentials`)
- Linux/macOS: `$XDG_CONFIG_HOME/smkd/credentials`, or
  `~/.config/smkd/credentials` when `XDG_CONFIG_HOME` is unset

Set `SMKD_CREDENTIALS_DIR` to override the location. Keep overrides outside the
repository. Create the directory with:

```powershell
.\scripts\dev\setup-credentials.ps1
```

Use `-Open` to open the folder in Explorer. The profile-circle menu in the app
shows the resolved path and can copy it; the location endpoint returns only the
path and whether the directory exists, never file contents.

## What is and is not stored

The folder is a separate user-local location for future provider-specific
configuration. **The app currently does not read or write credential files in
it.** No credential values were supplied or saved as part of this change.

Groww API credentials and access tokens remain in the backend process memory for
the connected session and are cleared on restart/disconnect. Do not copy Groww
keys into a plaintext file. Use the operating system credential store for
developer secrets; cloud credentials belong in the cloud provider's secret
manager. The dashboard profile menu is a local settings entry, not a Google sign-in
or cloud authorization flow.

Never commit `.env` files, API keys, OAuth client secrets, broker tokens, or
credential exports. Keep secrets out of notebooks, logs, screenshots, and test
fixtures. Only commit placeholder templates with no usable values.

## Development setup checks

Run the read-only environment check and focused tests with:

```powershell
.\scripts\dev\doctor.ps1
.\scripts\dev\verify.ps1
```

The doctor reports tool/submodule/configuration status without installing
dependencies or reading credential contents. `verify.ps1` runs documentation
consistency and the focused AI/profile UI tests; add `-Backend` to run the
backend API contract and storage-path tests too.
