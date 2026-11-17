# GitHub contribution identity

Use the repository-local helper to authenticate, set the current GitHub account
as the Git author, and safely publish feature branches. It never accepts,
prints, or writes a personal access token.

## Commands

Run from the repository root:

```powershell
$script = ".\scripts\dev\github-contribution.ps1"

# Check the local Git author and GitHub CLI login status.
& $script -Action Status

# Sign in through the browser; GitHub CLI manages its credential storage.
& $script -Action Login

# Set user.name and the account-specific GitHub noreply email from the active gh login.
& $script -Action SyncAccount

# Or set an explicit verified GitHub email and display name.
& $script -Action SetIdentity -Name "Dishant" -Email "verified-address@example.com"

# Preview reauthoring local, linear commits ahead of origin/main.
& $script -Action RewriteUnpublished -BaseRef origin/main -WhatIf
& $script -Action RewriteUnpublished -BaseRef origin/main

# Push the clean feature branch and create a PR for review.
& $script -Action Publish -BaseBranch main -Title "docs: add contribution workflow" -Body "Add safe GitHub identity and contribution commands."
```

If multiple GitHub accounts are logged in, select the intended account before
syncing identity:

```powershell
gh auth switch --hostname github.com --user dishant-techMAN
& $script -Action SyncAccount
```

`SyncAccount` uses the active authenticated account's login and ID to configure
the account-specific `ID+LOGIN@users.noreply.github.com` address. GitHub links a
commit to an account through its verified author email; the visible author name
alone is not sufficient. See [GitHub's commit email guidance](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-user-account/managing-email-preferences/setting-your-commit-email-address).

## Safety and contribution visibility

- Git identity is saved with `git config --local`, not globally.
- `Login` delegates browser authentication and Git credential setup to GitHub
  CLI. The script does not read tokens or put them in the repository.
- `RewriteUnpublished` can reauthor all linear commits between a base ref and
  HEAD. It requires a clean working tree, fetches remote refs, and refuses merge
  commits or commits already contained by another local or remote branch.
- `Publish` requires a clean feature branch, checks that every commit ahead of
  the base is attributed to the active GitHub account, then pushes without
  force and creates a PR (or reports the existing PR). It does not merge.
- `-WhatIf` previews mutating actions. Review the current branch and author
  before running a real rewrite or push.
- A pushed commit is attributed only if its email is verified on the GitHub
  account. To appear in the commit contribution graph, the commit generally
  needs to reach the default branch, commonly by merging its pull request.

GitHub CLI token setup and Git remote publishing are separate from SMKD market
data credentials. Never save a personal access token in this repository, a
script, `.env`, or a log.
