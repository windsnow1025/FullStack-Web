# Tips Entry

- Hyper-V boot loader failed
    - Hold down a key when starting up the virtual machine

- Hyper-V windows login problem
    - View >> Untick `Enhanced session`
    - Settings >> Accounts >> Sign-in options >> Untick `For improved security, only allow ...`
    - View >> Tick `Enhanced session`

- Adobe disable Recent Files
    - Preferences >> File Handling >> Recent File List Contains: 0

- Google Drive delete Shared Files
    - Report Abuse >> Delete

- Change device name, alert: A connection with the name you specified already exists
    - Download [https://github.com/jschicht/RunAsTI](https://github.com/jschicht/RunAsTI) to open CMD as TrustedInstaller
    - `CMD > regedit`
    - `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\NetworkSetup2\Interfaces\`
    - `IfAlias` property in `.\[Id]\Kernal\ifAlias` represents the name
    - Find the conflict one and delete its [Id] folder

- Enable intel graphic card in Asus motherboard
    - BIOS >> Advanced >> Graphics Configuration >> iGPU Multi-Monitor >> Enabled

- Browser Markdown Viewer Extension setup
    - Details >> Allow access to file URLs

- Spotify delete Local File Resources
    - Delte Spotify folder in `C:\Users\{username}\AppData\Local\Packages`

- Microsoft Edge managed by your organization
    - Registry Editor >> HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft >> Delete Edge folder

- Adobe Premiere Pro preview glich
    - RightClick Preview Window >> Enable `High Quality Playback`

- Clash for Windows 0.19.2+ TUN DNS Problem
    - TUN >> Reset >> Save

- Android DNS problem
    - Settings >> Network & Internet >> Advanced >> Private DNS >> Off

- Microsoft Excel change default font
    - File >> Options >> Language >> Office authoring languages and proofing >> Remove `Chinese (Simplified)`

- Microsoft Onenote fix Quick Notes language
    - Delete `%HOMEPATH%\AppData\Local\Microsoft\OneNote`

- `exec /custom-entrypoint.sh: no such file or directory`: Change the line endings of the file from CRLF to LF.

## Microsoft Word

- Change default font
    - `Design` >> `Fonts` >> `Office: Calibri Light` >> `Set as Default`

- All new documents opened in Compatibility Mode
    - `%HOMEPATH%\AppData\Roaming\Microsoft\Templates` >> Open `Normal.dotm` >> `File` >> `Info` >> `Compatibility Mode`: `Convert` >> `Save`

- Disable Auto Selection
    - `File` >> `Options` >> `Advanced` >> `Editing Options` >> Uncheck `When selecting, automatically select entire word`

- Precise ruler
    - Hold `Alt` when dragging the ruler

- Format formula copied from Wikipedia
    - Delete `\displaystyle` >> `Alt` + `+`
        - Equation: LaTeX
        - Convert: Current - Professional

## JetBrains

- Auto format
    - Format document: Ctrl + Alt + L

- Duplicate line
    - Ctrl + D

- Column Selection Mode
    - Alt + Shift + Insert

- Select occurrence
    - Select next: Alt + J
    - Select all: Ctrl + Shift + Alt + J

## Visual Studio Code

- Add cursors to end of selected lines
    - Alt + Shift + I

- Auto format
    - Format selection: Ctrl + K, Ctrl + F
    - Format document: Alt + Shift + F

- Column Select
    - Alt + Shift + MouseDrag

- Multiple Cursors
    - Hold Alt + Click

- Duplicate line
    - Alt + Shift + Down

- Select occurrence
    - Select next: Ctrl + D
    - Select all: Ctrl + Shift + L

## Visual Studio

- Auto format
    - Format selection: Ctrl + K, Ctrl + F
    - Format document: Ctrl + K, Ctrl + D

- Column Select
    - Alt + Shift + MouseDrag

- Duplicate line
    - Ctrl + E, Ctrl + V

- Select occurrence
    - Select next: Shift + Alt + .

## Git

- Remove cached files
    `git rm --cached <file>`

- Delete all commit history

```git
// Checkout

git checkout --orphan latest_branch

// Add all the files

git add -A

// Commit the changes

git commit -am "commit message"

// Delete the branch

git branch -D main

// Rename the current branch to main

git branch -m main

// Finally, force update your repository

git push -f origin main
```

- Delete a file from all commits

```git
git filter-branch --tree-filter 'rm -f <path_to_file>' HEAD
git push origin --force --all
```
